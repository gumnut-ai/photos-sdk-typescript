// @ts-check
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', '..', 'dist');

async function* walk(dir) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

async function finalizePackage() {
  for await (const file of walk(distDir)) {
    if (!/(\.d)?[cm]?ts$/.test(file)) continue;

    const code = await fs.promises.readFile(file, 'utf8');

    // strip out lib="dom", types="node", and types="react" references; these
    // are needed at build time, but would pollute the user's TS environment
    let transformed = code.replace(
      /^ *\/\/\/ *<reference +(lib="dom"|types="(node|react)").*?\n/gm,
      // replace with same number of characters to avoid breaking source maps
      (match) => ' '.repeat(match.length - 1) + '\n',
    );

    // TypeScript's declaration emitter collapses /** @ts-ignore */ onto the same
    // line as the type declaration, which doesn't work. So we convert to // @ts-ignore
    // on its own line to properly suppresses errors.
    if (file.endsWith('.d.ts') || file.endsWith('.d.mts') || file.endsWith('.d.cts')) {
      transformed = transformed.replace(/\/\*\* @ts-ignore\b[^*]*\*\/ /gm, '// @ts-ignore\n');
    }

    if (transformed !== code) {
      console.error(`wrote ${path.relative(process.cwd(), file)}`);
      await fs.promises.writeFile(file, transformed, 'utf8');
    }
  }

  const newExports = {
    '.': {
      require: {
        types: './index.d.ts',
        default: './index.js',
      },
      types: './index.d.mts',
      default: './index.mjs',
    },
  };

  for (const entry of await fs.promises.readdir(distDir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== 'src' && entry.name !== 'internal' && entry.name !== 'bin') {
      const subpath = './' + entry.name;
      newExports[subpath + '/*.mjs'] = {
        default: subpath + '/*.mjs',
      };
      newExports[subpath + '/*.js'] = {
        default: subpath + '/*.js',
      };
      newExports[subpath + '/*'] = {
        import: subpath + '/*.mjs',
        require: subpath + '/*.js',
      };
    } else if (entry.isFile() && /\.[cm]?js$/.test(entry.name)) {
      const { name, ext } = path.parse(entry.name);
      const subpathWithoutExt = './' + name;
      const subpath = './' + entry.name;
      newExports[subpathWithoutExt] ||= { import: undefined, require: undefined };
      const isModule = ext[1] === 'm';
      if (isModule) {
        newExports[subpathWithoutExt].import = subpath;
      } else {
        newExports[subpathWithoutExt].require = subpath;
      }
      newExports[subpath] = {
        default: subpath,
      };
    }
  }
  // Add the legacy require('gumnut-sdk') constructor after the emitted code.
  // Inserting it near the top would invalidate the compiler's source-map positions.
  const indexPath = path.join(distDir, 'index.js');
  const index = await fs.promises.readFile(indexPath, 'utf8');
  const mapOffset = index.lastIndexOf('//# sourceMappingURL=');
  if (mapOffset < 0) throw new Error('Compiled index.js is missing its source-map reference');
  const constructorShim = `const namespace = module.exports;
module.exports = function (...args) { return new module.exports.default(...args); };
Object.defineProperties(module.exports, Object.getOwnPropertyDescriptors(namespace));
`;
  await fs.promises.writeFile(
    indexPath,
    index.slice(0, mapOffset) + constructorShim + index.slice(mapOffset),
  );

  const packageJson = JSON.parse(
    await fs.promises.readFile(path.join(distDir, '..', 'package.json'), 'utf8'),
  );
  for (const key of ['types', 'main', 'module']) {
    if (typeof packageJson[key] === 'string') {
      packageJson[key] = packageJson[key].replace(/^(\.\/)?dist\//, './');
    }
  }
  delete packageJson.devDependencies;
  for (const hook of ['prepack', 'prepublishOnly', 'prepare']) delete packageJson.scripts[hook];
  packageJson.exports = newExports;
  await fs.promises.writeFile(
    path.join(distDir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n',
  );
}

finalizePackage();
