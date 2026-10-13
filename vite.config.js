import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative asset paths so the site works under a sub-path such as GitHub Pages' /journalDaily/.
  base: './',
  plugins: [react(), tailwindcss()],
})
