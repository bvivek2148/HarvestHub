import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'

const forSites = process.env?.FOR_SITES === 'true'

import fs from 'node:fs'
import path from 'node:path'

const serveUploadsPlugin = () => ({
  name: 'serve-uploads',
  configureServer(server: any) {
    server.middlewares.use('/uploads', (req: any, res: any, next: any) => {
      if (!req.url) return next()
      const filePath = path.join(process.cwd(), 'public', 'uploads', req.url.split('?')[0])
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).toLowerCase()
        const mimeTypes: Record<string, string> = {
          '.webp': 'image/webp',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif'
        }
        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
        res.setHeader('Cache-Control', 'no-cache')
        fs.createReadStream(filePath).pipe(res)
      } else {
        next()
      }
    })
  }
})

const config = defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    serveUploadsPlugin(),
    process.env.VERCEL
      ? nitroV2Plugin({
          compatibilityDate: '2025-10-08',
          preset: 'vercel',
        })
      : forSites &&
        nitroV2Plugin({
          compatibilityDate: '2025-10-08',
          preset: 'node',
        }),
    devtoolsJson(),
    viteReact(),
  ],
  server: {
    host: '::',
    allowedHosts: true,
    hmr: true,
  },
})

export default config
