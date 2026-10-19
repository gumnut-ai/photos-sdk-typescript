const fs = require('fs');
const path = require('path');

async function patchConstructor() {
  // Add the legacy require('gumnut-sdk') constructor after the emitted code.
  // Inserting it near the top would invalidate the compiler's source-map positions.
  const indexPath = path.resolve(__dirname, '..', '..', 'dist', 'index.js');
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
}

patchConstructor();
