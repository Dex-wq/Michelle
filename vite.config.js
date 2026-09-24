import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Link previews (WhatsApp, iMessage…) need absolute URLs. Vercel provides the production
// domain at build time, so this keeps working if the project gets a custom domain later.
const SITE_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || 'esther-seven-sepia.vercel.app'}`

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', SITE_URL) },
  ],
})
