'use strict';

const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');
const { test } = require('node:test');
const helper = path.join(__dirname, 'with-mock-server.cjs');

async function fixture(t, { startupFailure = false, installHang = false } = {}) {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'sdk-mock-test-'));
  const children = [];
  let stopping;
  const stop = () =>
    (stopping ??= (async () => {
      for (const { child } of children) {
        if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
      }
      // Give the helper time to clean its detached groups, then enforce teardown
      // using only group IDs recorded by this fixture's mock and test processes.
      await Promise.race([
        Promise.allSettled(children.map(({ done }) => done)),
        delay(1500, undefined, { ref: false }),
      ]);
      const ownedPids = children.flatMap(({ child }) => (child.pid ? [child.pid] : []));
      for (const file of ['pids.json', 'test-pids.json']) {
        try {
          const recorded = JSON.parse(await fs.readFile(path.join(cwd, file), 'utf8'));
          ownedPids.push(...recorded);
          const [group] = recorded;
          try {
            process.kill(-group, 'SIGKILL');
          } catch (error) {
            if (error.code !== 'ESRCH') throw error;
          }
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
        }
      }
      for (const { child } of children) {
        if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
      }
      await assertStopped(ownedPids);
    })());
  // Registered before any child starts or PID-file wait can fail. Remove the
  // fixture only after its owned processes have been stopped.
  t.after(async () => {
    try {
      await stop();
    } finally {
      await fs.rm(cwd, { recursive: true, force: true });
    }
  });
  await fs.mkdir(path.join(cwd, 'scripts'));
  await fs.writeFile(
    path.join(cwd, 'scripts/mock'),
    `#!/usr/bin/env bash
if [ "\${1:-}" = --install ]; then
  node -e 'const { npm_config_yes, STAINLESS_OPENAPI_SPEC_URL } = process.env; require("node:fs").writeFileSync("install.json", JSON.stringify({ npm_config_yes, STAINLESS_OPENAPI_SPEC_URL }))'
  ${installHang ? 'exec node server.cjs' : 'exit 0'}
fi
exec node server.cjs
`,
  );
  await fs.writeFile(
    path.join(cwd, 'server.cjs'),
    `
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const grandchild = spawn(process.execPath, ['-e', 'process.on("SIGTERM", () => {}); setInterval(() => {}, 1000)']);
fs.writeFileSync('pids.json', JSON.stringify([process.pid, grandchild.pid]));
${
  startupFailure
    ? 'setTimeout(() => process.exit(9), 150);'
    : `
require('node:http').createServer((req, res) => {
  res.writeHead(req.url === '/_x-steady/health' ? 200 : 404);
  res.end('ok');
}).listen(Number(process.env.STAINLESS_MOCK_PORT), '127.0.0.1');`
}
`,
  );
  return {
    cwd,
    stop,
    run(source) {
      const running = run(cwd, source);
      children.push(running);
      return running;
    },
  };
}

function run(cwd, source) {
  const child = spawn(process.execPath, [helper, process.execPath, '-e', source], {
    cwd,
    env: {
      ...process.env,
      TEST_API_BASE_URL: 'https://should-not-be-used.invalid',
      STAINLESS_MOCK_PORT: '1',
      STAINLESS_OPENAPI_SPEC_URL: 'https://should-not-be-used.invalid/spec',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (data) => {
    output += data;
  });
  child.stderr.on('data', (data) => {
    output += data;
  });
  const done = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => resolve({ code, signal, output }));
  });
  return { child, done };
}

async function readEventually(file) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      return JSON.parse(await fs.readFile(file, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    await delay(25);
  }
  throw new Error(`Timed out waiting for ${file}`);
}

function isLinuxDeadProcess(stat) {
  // The parenthesized command may contain spaces and closing parentheses.
  const state = stat.slice(stat.lastIndexOf(')') + 2).split(' ', 1)[0];
  return state === 'Z' || state === 'X';
}

async function assertStopped(pids) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const live = await Promise.all(
      pids.map(async (pid) => {
        try {
          process.kill(pid, 0);
          if (process.platform === 'linux') {
            // A terminated orphan may remain a zombie until container PID 1 reaps it.
            return !isLinuxDeadProcess(await fs.readFile(`/proc/${pid}/stat`, 'utf8'));
          }
          return true;
        } catch (error) {
          if (error.code === 'ESRCH' || error.code === 'ENOENT') return false;
          throw error;
        }
      }),
    );
    if (!live.some(Boolean)) return;
    await delay(25);
  }
  assert.fail(`Processes still alive: ${pids.join(', ')}`);
}

test('Linux process state distinguishes terminated processes from live ones', () => {
  for (const state of ['Z', 'X']) {
    assert.equal(isLinuxDeadProcess(`123 (worker (child)) ${state} 1 2 3`), true);
  }
  for (const state of ['R', 'S', 'D', 'T', 'I']) {
    assert.equal(isLinuxDeadProcess(`123 (worker (child)) ${state} 1 2 3`), false);
  }
});

test('uses an installed, healthy loopback mock and removes remote overrides', {
  timeout: 10_000,
}, async (t) => {
  const { cwd, run } = await fixture(t);
  const { done } = run(
    `
    const assert = require('node:assert/strict');
    const fs = require('node:fs');
    assert.equal(process.env.STAINLESS_OPENAPI_SPEC_URL, undefined);
    assert.equal(process.env.TEST_API_BASE_URL, 'http://127.0.0.1:' + process.env.STAINLESS_MOCK_PORT);
    assert.notEqual(process.env.STAINLESS_MOCK_PORT, '1');
    const installed = JSON.parse(fs.readFileSync('install.json'));
    assert.equal(installed.npm_config_yes, 'true');
    assert.equal(installed.STAINLESS_OPENAPI_SPEC_URL, undefined);
    fetch(process.env.TEST_API_BASE_URL + '/_x-steady/health').then(r => assert.equal(r.status, 200));
  `,
  );
  const result = await done;
  assert.equal(result.code, 0, result.output);
  await assertStopped(await readEventually(path.join(cwd, 'pids.json')));
});

test('preserves command failure and kills mock descendants', { timeout: 10_000 }, async (t) => {
  const { cwd, run } = await fixture(t);
  const result = await run('process.exit(37)').done;
  assert.equal(result.code, 37, result.output);
  await assertStopped(await readEventually(path.join(cwd, 'pids.json')));
});

test('startup failure skips the command and cleans descendants', { timeout: 10_000 }, async (t) => {
  const { cwd, run } = await fixture(t, { startupFailure: true });
  const result = await run('require("node:fs").writeFileSync("ran", "bad")').done;
  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Mock server exited/);
  await assert.rejects(fs.stat(path.join(cwd, 'ran')), { code: 'ENOENT' });
  await assertStopped(await readEventually(path.join(cwd, 'pids.json')));
});

for (const [signal, expected] of [
  ['SIGINT', 130],
  ['SIGTERM', 143],
]) {
  test(`${signal} kills the command and mock process groups`, { timeout: 10_000 }, async (t) => {
    const { cwd, run } = await fixture(t);
    const { child, done } = run(
      `
      const { spawn } = require('node:child_process');
      const descendant = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)']);
      require('node:fs').writeFileSync('test-pids.json', JSON.stringify([process.pid, descendant.pid]));
      setInterval(() => {}, 1000);
    `,
    );
    const testPids = await readEventually(path.join(cwd, 'test-pids.json'));
    const mockPids = await readEventually(path.join(cwd, 'pids.json'));
    child.kill(signal);
    const result = await done;
    assert.equal(result.code, expected, result.output);
    await assertStopped([...mockPids, ...testPids]);
  });
}

test('termination during installation cleans installer descendants', { timeout: 10_000 }, async (t) => {
  const { cwd, run } = await fixture(t, { installHang: true });
  const { child, done } = run('process.exit(0)');
  const pids = await readEventually(path.join(cwd, 'pids.json'));
  child.kill('SIGTERM');
  const result = await done;
  assert.equal(result.code, 143, result.output);
  await assertStopped(pids);
});

test('fixture teardown stops owned processes after a missing PID-file wait', {
  timeout: 10_000,
}, async (t) => {
  const { cwd, run, stop } = await fixture(t);
  const { child } = run(`
    const descendant = require('node:child_process').spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)']);
    require('node:fs').writeFileSync('test-pids.json', JSON.stringify([process.pid, descendant.pid]));
    setInterval(() => {}, 1000);
  `);
  const mockPids = await readEventually(path.join(cwd, 'pids.json'));
  const testPids = await readEventually(path.join(cwd, 'test-pids.json'));
  try {
    await assert.rejects(readEventually(path.join(cwd, 'missing-pids.json')), /Timed out waiting/);
  } finally {
    // Exercise the same cleanup registered with t.after, before the fixture is removed.
    await stop();
  }
  await assertStopped([child.pid, ...mockPids, ...testPids]);
});
