// Type-checks the TypeScript and JavaScript code blocks in README.md, so a broken example fails lint.
//
// Each block compiles as its own module against the SDK source. A block may use `client` and
// `Gumnut` without declaring them, as README fragments do. Mark a block that needs a package or
// runtime this repository doesn't install by putting `<!-- readme-snippet-check: skip -->` before it.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SKIP_MARKER = '<!-- readme-snippet-check: skip -->';
const LANGUAGES = new Set(['ts', 'typescript', 'js', 'javascript']);

const root = path.resolve(__dirname, '..', '..');
const lines = fs.readFileSync(path.join(root, 'README.md'), 'utf8').split('\n');

const blocks = [];
let skipped = 0;
for (let i = 0; i < lines.length; i++) {
  const open = /^```(\S*)\s*$/.exec(lines[i]);
  if (!open || !open[1]) continue;
  const end = lines.findIndex((line, j) => j > i && /^```\s*$/.test(line));
  if (end === -1) throw new Error(`README.md:${i + 1}: unclosed code block`);
  if (LANGUAGES.has(open[1])) {
    if (precededBySkipMarker(i)) skipped++;
    else blocks.push({ firstLine: i + 2, code: lines.slice(i + 1, end).join('\n') });
  }
  i = end;
}

// Looks back over the blank lines and HTML comments (such as `<!-- prettier-ignore -->`) above a fence.
function precededBySkipMarker(fence) {
  for (let j = fence - 1; j >= 0 && /^(<!--.*-->)?\s*$/.test(lines[j]); j--) {
    if (lines[j].trim() === SKIP_MARKER) return true;
  }
  return false;
}

if (blocks.length === 0) {
  console.error('No TypeScript or JavaScript code blocks found in README.md');
  process.exit(1);
}

const cacheDir = path.join(root, 'node_modules', '.cache');
fs.mkdirSync(cacheDir, { recursive: true });
const dir = fs.mkdtempSync(path.join(cacheDir, 'readme-snippets-'));
try {
  const files = blocks.map((block, index) => {
    const file = `snippet-${index}.ts`;
    // `export {}` makes every block a module, so its declarations shadow the globals below.
    fs.writeFileSync(path.join(dir, file), `${block.code}\nexport {};\n`);
    return file;
  });
  fs.writeFileSync(
    path.join(dir, 'globals.d.ts'),
    [
      "import type ClientClass from 'gumnut-sdk';",
      'declare global {',
      "  const Gumnut: typeof import('gumnut-sdk').default;",
      '  const client: ClientClass;',
      '}',
      'export {};',
      '',
    ].join('\n'),
  );
  fs.writeFileSync(
    path.join(dir, 'tsconfig.json'),
    JSON.stringify({
      extends: path.relative(dir, path.join(root, 'tsconfig.json')),
      include: [],
      files: ['globals.d.ts', ...files],
      // README examples use top-level await.
      compilerOptions: { module: 'esnext', target: 'es2022', lib: ['es2022'] },
    }),
  );

  const result = spawnSync(
    path.join(root, 'node_modules', 'typescript', 'bin', 'tsc'),
    ['--project', path.join(dir, 'tsconfig.json'), '--pretty', 'false'],
    { cwd: root, encoding: 'utf8' },
  );
  if (result.error) throw result.error;
  const output = `${result.stdout}${result.stderr}`.replace(
    /^.*snippet-(\d+)\.ts\((\d+),(\d+)\)/gm,
    (_, index, line, column) => `README.md(${blocks[index].firstLine + Number(line) - 1},${column})`,
  );
  process.stdout.write(output);
  // Set the exit code rather than exiting, so `finally` still removes the directory.
  if (result.status !== 0) process.exitCode = result.status ?? 1;
  else console.log(`Type-checked ${blocks.length} README code blocks (${skipped} skipped)`);
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
