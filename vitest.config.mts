import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      { find: /^gumnut-sdk$/, replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)) },
      { find: /^gumnut-sdk\/(.*)$/, replacement: `${fileURLToPath(new URL('./src/', import.meta.url))}$1` },
    ],
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
});
