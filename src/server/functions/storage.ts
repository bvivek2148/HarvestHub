import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import fs from 'node:fs'
import path from 'node:path'

export const uploadListingImageFn = createServerFn({ method: 'POST' }).handler(
  async (ctx: any) => {
    const data = ctx.data as { fileBase64: string; fileName: string; mimeType: string }
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('Unauthorized')
    }

    try {
      const buffer = Buffer.from(data.fileBase64, 'base64')
      const sanitizedName = data.fileName.replace(/[^a-zA-Z0-9.\-_]/g, '')
      const finalFileName = `${Date.now()}_${sanitizedName}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', userId)
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      const filePath = path.join(uploadDir, finalFileName)
      fs.writeFileSync(filePath, buffer)

      // Return the public URL path
      return `/uploads/${userId}/${finalFileName}`
      
    } catch (error: any) {
      console.error('[uploadListingImageFn] Failed to upload image:', error)
      throw new Error(error.message || 'Image upload failed')
    }
  }
)
