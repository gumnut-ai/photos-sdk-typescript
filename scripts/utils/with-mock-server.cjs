#!/usr/bin/env node
'use strict';

const { spawn } = require('node:child_process');
const http = require('node:http');
const net = require('node:net');
const { setTimeout: delay } = require('node:timers/promises');

const groups = new Set();
let signalCode;
let shuttingDown = false;
let interrupt;
const interrupted = new Promise((_, reject) => {
  interrupt = reject;
});
// A signal may arrive before the first awaited operation.
interrupted.catch(() => {});
for (const [signal, code] of [
  ['SIGINT', 130],
  ['SIGTERM', 143],
]) {
  process.on(signal, () => {
    signalCode ??= code;
    interrupt(new Error(`Interrupted by ${signal}`));
  });
}

function killGroup(pid, signal) {
  try {
    process.kill(-pid, signal);
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
}

async function cleanup() {
  for (const pid of groups) killGroup(pid, 'SIGTERM');
  // Kill descendants even if their shell/npm parent has already exited.
  if (groups.size) await delay(500);
  for (const pid of groups) killGroup(pid, 'SIGKILL');
  groups.clear();
}

function launch(command, args, env) {
  const child = spawn(command, args, { env, stdio: 'inherit', detached: true });
  if (child.pid) groups.add(child.pid);
  const done = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => resolve({ code, signal }));
  });
  return { child, done };
}

async function bounded(operation, milliseconds, message) {
  let timer;
  try {
    return await Promise.race([
      operation,
      interrupted,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), milliseconds);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function availablePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  return port;
}

function healthy(port) {
  return new Promise((resolve) => {
    const request = http.get({ host: '127.0.0.1', port, path: '/_x-steady/health' }, (response) => {
      response.resume();
      resolve(response.statusCode >= 200 && response.statusCode < 300);
    });
    request.setTimeout(250, () => request.destroy());
    request.once('error', () => resolve(false));
  });
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command) throw new Error('Usage: node scripts/utils/with-mock-server.cjs <command> <args...>');
  const port = await availablePort();
  const env = {
    ...process.env,
    npm_config_yes: 'true',
    STAINLESS_MOCK_PORT: String(port),
    TEST_API_BASE_URL: `http://127.0.0.1:${port}`,
  };
  delete env.STAINLESS_OPENAPI_SPEC_URL;
  const install = launch('bash', ['scripts/mock', '--install'], env);
  const installed = await bounded(install.done, 120_000, 'Mock installation timed out after 120 seconds');
  if (installed.code !== 0)
    throw new Error(`Mock installation failed (${installed.code ?? installed.signal})`);
  await cleanup();
  if (signalCode) return signalCode;

  const server = launch('bash', ['scripts/mock'], env);
  const serverStopped = server.done.then(({ code, signal }) => {
    throw new Error(`Mock server exited before tests completed (${code ?? signal})`);
  });
  // Keep monitoring the owned server while the test command runs.
  serverStopped.catch(() => {});
  const readiness = (async () => {
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      if (signalCode || shuttingDown) return;
      if (await healthy(port)) return;
      await delay(100);
    }
    throw new Error('Mock server was not healthy within 30 seconds');
  })();
  await bounded(
    Promise.race([readiness, serverStopped]),
    30_000,
    'Mock server was not healthy within 30 seconds',
  );
  if (signalCode) return signalCode;
  const test = launch(command, args, env);
  const result = await Promise.race([test.done, serverStopped, interrupted]);
  return result.code ?? (result.signal === 'SIGINT' ? 130 : result.signal === 'SIGTERM' ? 143 : 1);
}

(async () => {
  let code = 1;
  try {
    code = await main();
  } catch (error) {
    console.error(`[with-mock-server] ${error.message}`);
  } finally {
    shuttingDown = true;
    await cleanup();
    process.exitCode = signalCode ?? code;
  }
})();
