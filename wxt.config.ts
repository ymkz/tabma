import react from '@vitejs/plugin-react'
import { defineConfig } from 'wxt'

export default defineConfig({
  srcDir: 'src',
  entrypointsDir: 'app',
  manifest: { permissions: ['tabs', 'storage', 'contextMenus'] },
  vite: () => ({ plugins: [react()] }),
})
