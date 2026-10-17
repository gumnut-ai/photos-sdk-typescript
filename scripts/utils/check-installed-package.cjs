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
  // Node's legacy resolver and conditional CJS/ESM exports all remain supported.
  for (const [extension, module, moduleResolution] of [
    ['ts', 'commonjs', 'node'],
    ['cts', 'Node16', 'node16'],
    ['mts', 'Node16', 'node16'],
  ]) {
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
  console.log(
    'Installed package passed CommonJS, ESM, import aliases, source maps, and TypeScript 4.9 checks.',
  );
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
