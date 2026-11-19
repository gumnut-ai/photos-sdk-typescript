import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const packageName = 'gumnut-sdk';
const escapedName = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default defineConfig({
  resolve: {
    alias: [
      {
        find: new RegExp(`^${escapedName}$`),
        replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      },
      {
        find: new RegExp(`^${escapedName}/(.*)$`),
        replacement: `${fileURLToPath(new URL('./src/', import.meta.url))}$1`,
      },
    ],
  },
  test: { environment: 'node', globals: true, include: ['tests/**/*.test.ts'] },
});
