const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const { SourceMap } = require('node:module');
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

function typeCheck(tsc, extension, module, moduleResolution, directory = consumer, skipLibCheck = false) {
  fs.writeFileSync(
    path.join(directory, 'tsconfig.json'),
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
        skipLibCheck,
      },
      files: [`consumer.${extension}`],
    }),
  );
  run(process.execPath, [tsc, '--project', 'tsconfig.json'], directory);
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
assert.equal(require('gumnut-sdk/index'), Gumnut);
assert.equal(require('gumnut-sdk/index.js'), Gumnut);
assert.equal(require('gumnut-sdk/resources/albums.js').Albums, Albums);
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
import IndexGumnut from 'gumnut-sdk/index';
import JsGumnut from 'gumnut-sdk/index.js';
import MjsGumnut from 'gumnut-sdk/index.mjs';
import { Albums as JsAlbums } from 'gumnut-sdk/resources/albums.js';
import { Albums as MjsAlbums } from 'gumnut-sdk/resources/albums.mjs';
assert.equal(Gumnut, NamedGumnut);
assert.equal(IndexGumnut, Gumnut);
assert.equal(MjsGumnut, Gumnut);
assert.equal(MjsAlbums, Albums);
assert(new JsGumnut({ apiKey: 'package-check' }).albums instanceof JsAlbums);
assert.equal(typeof APIError, 'function');
assert.equal(typeof toFile, 'function');
const client = new Gumnut({ apiKey: 'package-check' });
assert(client.albums instanceof Albums);
`,
  );
  run(process.execPath, ['consumer.cjs']);
  run(process.execPath, ['consumer.mjs']);
  // The README lists Bun as a supported runtime, so load the same entry points there.
  run('bun', ['consumer.cjs']);
  run('bun', ['consumer.mjs']);

  let javascriptMaps = 0;
  let declarationMaps = 0;
  function checkMaps(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        checkMaps(filename);
      } else if (entry.name.endsWith('.map')) {
        const payload = JSON.parse(fs.readFileSync(filename, 'utf8'));
        assert(payload.sources.length > 0, filename + ' must reference source files');
        for (const source of payload.sources) {
          const resolved = path.resolve(path.dirname(filename), payload.sourceRoot || '', source);
          assert(resolved.startsWith(installed + path.sep), filename + ' source escapes package: ' + source);
          assert(fs.statSync(resolved).isFile(), filename + ' source is missing: ' + source);
        }
        if (/\.d\.[cm]?ts\.map$/.test(entry.name)) declarationMaps++;
        else javascriptMaps++;
      }
    }
  }
  checkMaps(installed);
  assert(javascriptMaps > 0, 'Expected shipped JavaScript source maps');
  assert(declarationMaps > 0, 'Expected shipped declaration source maps');
  const generated = fs.readFileSync(path.join(installed, 'index.js'), 'utf8').split('\n');
  const original = fs.readFileSync(path.join(installed, 'src/index.ts'), 'utf8').split('\n');
  const generatedLine = generated.findIndex((line) =>
    /^var \w+ = require\(["']\.\/client\.js["']\);/.test(line),
  );
  const originalLine = original.findIndex((line) => line.includes('export { Gumnut as default }'));
  assert(generatedLine >= 0 && originalLine >= 0, 'Expected root client import and source export');
  const payload = JSON.parse(fs.readFileSync(path.join(installed, 'index.js.map'), 'utf8'));
  const entry = new SourceMap(payload).findEntry(generatedLine, 0);
  assert.equal(
    path.resolve(installed, payload.sourceRoot || '', entry.originalSource),
    path.join(installed, 'src/index.ts'),
  );
  assert.equal(
    entry.originalLine,
    originalLine,
    'CommonJS root client import must map to its original export line',
  );
  console.log('Installed source maps reference shipped sources and preserve the CommonJS root mapping.');

  // TypeScript 5.0 is the stated minimum. Keep each compiler separate: runtime consumers cannot
  // resolve tooling devDependencies.
  fs.writeFileSync(path.join(compiler, 'package.json'), JSON.stringify({ private: true }));
  run(
    'npm',
    ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--save-exact', 'typescript@5.0.4'],
    compiler,
  );
  const tsc5 = path.join(compiler, 'node_modules/typescript/bin/tsc');
  assert.equal(run(process.execPath, [tsc5, '--version'], consumer, true).trim(), 'Version 5.0.4');
  const source = `import Gumnut, { Gumnut as NamedGumnut, type ClientOptions } from 'gumnut-sdk';
import { Albums, type AlbumResponse } from 'gumnut-sdk/resources/albums';
import IndexGumnut from 'gumnut-sdk/index';
import { Gumnut as JsGumnut } from 'gumnut-sdk/index.js';
import { Albums as JsAlbums } from 'gumnut-sdk/resources/albums.js';
import type { APIPromise } from 'gumnut-sdk/core/api-promise';
const options: ClientOptions = { apiKey: 'package-check' };
const client: NamedGumnut = new Gumnut(options);
const albums: Albums = client.albums;
const requestOptions: Gumnut.RequestOptions = { maxRetries: 0 };
declare const variant: Gumnut.AssetVariant;
declare const user: Gumnut.UserSummary;
const jsAlbums: JsAlbums = new JsGumnut({ apiKey: 'package-check' }).albums;
const indexClient: NamedGumnut = new IndexGumnut(options);
const response: APIPromise<AlbumResponse> = albums.create({}, requestOptions);
void variant;
void user;
void jsAlbums;
void indexClient;
void response;
`;
  for (const extension of ['ts', 'cts', 'mts']) {
    fs.writeFileSync(
      path.join(consumer, `consumer.${extension}`),
      source +
        (extension === 'mts'
          ? `import MjsGumnut from 'gumnut-sdk/index.mjs';
import { Albums as MjsAlbums } from 'gumnut-sdk/resources/albums.mjs';
const mjsAlbums: MjsAlbums = new MjsGumnut(options).albums;
void mjsAlbums;
`
          : ''),
    );
  }
  // Node's legacy resolver and conditional CJS/ESM exports all remain supported, as does bundler.
  const minimumModes = [
    ['ts', 'commonjs', 'node'],
    ['cts', 'Node16', 'node16'],
    ['mts', 'Node16', 'node16'],
    ['ts', 'ESNext', 'bundler'],
  ];
  for (const [extension, module, moduleResolution] of minimumModes) {
    typeCheck(tsc5, extension, module, moduleResolution);
  }

  // TypeScript 7 removed the legacy `node` resolver; check the Node and bundler resolvers it keeps.
  const compiler7 = path.join(temporary, 'compiler-7');
  fs.mkdirSync(compiler7);
  fs.writeFileSync(path.join(compiler7, 'package.json'), JSON.stringify({ private: true }));
  run(
    'npm',
    ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--save-exact', 'typescript@7.0.2'],
    compiler7,
  );
  const tsc7 = path.join(compiler7, 'node_modules/typescript/bin/tsc');
  assert.equal(run(process.execPath, [tsc7, '--version'], consumer, true).trim(), 'Version 7.0.2');
  for (const [extension, module, moduleResolution] of [
    ['cts', 'Node16', 'node16'],
    ['mts', 'Node16', 'node16'],
    ['ts', 'ESNext', 'bundler'],
  ]) {
    typeCheck(tsc7, extension, module, moduleResolution);
  }

  // Runtime-specific fetchOptions come from optional parent node_modules type imports. Type-check the
  // README's Node proxy example against the installed package, in a consumer with undici installed.
  // Check them on the 5.0 minimum and TypeScript 7.
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.match(
    readme,
    /^TypeScript >= 5\.0 is supported/m,
    'README minimum must match the 5.0 compiler checked above',
  );
  const marked = [
    ...readme.matchAll(/<!-- readme-snippet-check: installed-package -->\s*```ts\n([^]*?)\n```/g),
  ];
  assert.equal(marked.length, 1, 'Expected one README example marked for the installed package check');
  const proxyExample = marked[0][1];
  assert.match(proxyExample, /dispatcher:/);
  const proxyConsumer = path.join(temporary, 'proxy-consumer');
  fs.mkdirSync(proxyConsumer);
  fs.writeFileSync(path.join(proxyConsumer, 'package.json'), JSON.stringify({ private: true }));
  // undici's declarations need Node's; use the version this SDK locks.
  const nodeTypes = JSON.parse(
    fs.readFileSync(path.join(root, 'node_modules/@types/node/package.json'), 'utf8'),
  ).version;
  run(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--save-exact',
      tarball,
      'undici@8.12.3',
      `@types/node@${nodeTypes}`,
    ],
    proxyConsumer,
  );
  for (const [extension, module, moduleResolution] of [
    ['cts', 'Node16', 'node16'],
    ['mts', 'Node16', 'node16'],
    ['ts', 'ESNext', 'bundler'],
  ]) {
    fs.writeFileSync(path.join(proxyConsumer, `consumer.${extension}`), proxyExample + '\n');
    typeCheck(tsc7, extension, module, moduleResolution, proxyConsumer);
  }
  // Current @types/node needs a newer compiler than 5.0, so skip library checks there; the 5.0 checks
  // above cover the SDK's own declarations.
  for (const [extension, module, moduleResolution] of minimumModes) {
    fs.writeFileSync(path.join(proxyConsumer, `consumer.${extension}`), proxyExample + '\n');
    typeCheck(tsc5, extension, module, moduleResolution, proxyConsumer, true);
  }
  console.log(
    'Installed package passed CommonJS, ESM, Bun, import aliases, source maps, TypeScript 5.0 and 7, and fetchOptions checks.',
  );
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
