import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    // Let jsdom provide browser storage instead of Node's experimental storage.
    execArgv: ['--no-experimental-webstorage'],
    setupFiles: './tests/setup.js',
  },
})
