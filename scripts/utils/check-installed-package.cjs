const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'gumnut-installed-package-'));
const consumer = path.join(temporary, 'consumer');
const compiler = path.join(temporary, 'compiler');
const environment = { ...process.env, NODE_PATH: '' };

function run(command, args, cwd = consumer, capture = false) {
  return execFileSync(command, args, {
    cwd,
    env: environment,
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
    encoding: 'utf8',
  });
}

try {
  assert(!temporary.startsWith(`${root}${path.sep}`), 'Consumer must be outside the checkout');
  fs.mkdirSync(consumer);
  fs.mkdirSync(compiler);
  // An optional prebuilt tarball lets regression checks exercise damaged packages, too.
  const tarball = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(
        temporary,
        JSON.parse(
          run(
            'npm',
            ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary],
            path.join(root, 'dist'),
            true,
          ),
        )[0].filename,
      );
  fs.writeFileSync(path.join(consumer, 'package.json'), JSON.stringify({ private: true }));
  run('npm', ['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', tarball]);
  const installed = path.join(consumer, 'node_modules/gumnut-sdk');
  assert(!fs.lstatSync(installed).isSymbolicLink(), 'Expected an installed tarball, not a checkout link');
  assert.equal(JSON.parse(fs.readFileSync(path.join(installed, 'package.json'))).devDependencies, undefined);

  fs.writeFileSync(
    path.join(consumer, 'consumer.cjs'),
    `const assert = require('node:assert/strict');
const Gumnut = require('gumnut-sdk');
const { Gumnut: NamedGumnut, APIError, toFile } = Gumnut;
const { Albums } = require('gumnut-sdk/resources/albums');
assert.equal(typeof NamedGumnut, 'function');
assert.equal(typeof APIError, 'function');
assert.equal(typeof toFile, 'function');
const client = new Gumnut({ apiKey: 'package-check' });
assert(client instanceof NamedGumnut);
assert(new NamedGumnut({ apiKey: 'package-check' }) instanceof NamedGumnut);
assert(client.albums instanceof Albums);
`,
  );
  fs.writeFileSync(
    path.join(consumer, 'consumer.mjs'),
    `import assert from 'node:assert/strict';
import Gumnut, { Gumnut as NamedGumnut, APIError, toFile } from 'gumnut-sdk';
import { Albums } from 'gumnut-sdk/resources/albums';
assert.equal(Gumnut, NamedGumnut);
assert.equal(typeof APIError, 'function');
assert.equal(typeof toFile, 'function');
const client = new Gumnut({ apiKey: 'package-check' });
assert(client.albums instanceof Albums);
`,
  );
  run(process.execPath, ['consumer.cjs']);
  run(process.execPath, ['consumer.mjs']);

  // Keep the minimum compiler separate: runtime consumers cannot resolve tooling devDependencies.
  fs.writeFileSync(path.join(compiler, 'package.json'), JSON.stringify({ private: true }));
  run(
    'npm',
    ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--save-exact', 'typescript@4.9.5'],
    compiler,
  );
  const tsc = path.join(compiler, 'node_modules/typescript/bin/tsc');
  assert.equal(run(process.execPath, [tsc, '--version'], consumer, true).trim(), 'Version 4.9.5');
  const source = `import Gumnut, { Gumnut as NamedGumnut, type ClientOptions } from 'gumnut-sdk';
import { Albums, type AlbumResponse } from 'gumnut-sdk/resources/albums';
import type { APIPromise } from 'gumnut-sdk/core/api-promise';
const options: ClientOptions = { apiKey: 'package-check' };
const client: NamedGumnut = new Gumnut(options);
const albums: Albums = client.albums;
const response: APIPromise<AlbumResponse> = albums.create({}, { maxRetries: 0 });
void response;
`;
  // Node's legacy resolver and conditional CJS/ESM exports all remain supported.
  for (const [extension, module, moduleResolution] of [
    ['ts', 'commonjs', 'node'],
    ['cts', 'Node16', 'node16'],
    ['mts', 'Node16', 'node16'],
  ]) {
    fs.writeFileSync(path.join(consumer, `consumer.${extension}`), source);
    fs.writeFileSync(
      path.join(consumer, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          noEmit: true,
          target: 'ES2020',
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          module,
          moduleResolution,
          esModuleInterop: true,
          types: [],
          skipLibCheck: false,
        },
        files: [`consumer.${extension}`],
      }),
    );
    run(process.execPath, [tsc, '--project', 'tsconfig.json']);
  }
  console.log('Installed package passed CommonJS, ESM, deep imports, and TypeScript 4.9 checks.');
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
