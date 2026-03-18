import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/main.js', 'src/db.js'],
    },
  },
})
