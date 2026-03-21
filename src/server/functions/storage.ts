import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { getFirebaseAdmin } from '../admin'

export const uploadListingImageFn = createServerFn({ method: 'POST' }).handler(
  async (ctx: any) => {
    const data = ctx.data as { fileBase64: string; fileName: string; mimeType: string }
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    try {
      const { adminStorage } = await getFirebaseAdmin()
      const bucketName = process.env.VITE_FIREBASE_STORAGE_BUCKET || 'harvesthub-a8e30.firebasestorage.app'
      const bucket = adminStorage.bucket(bucketName)

      const buffer = Buffer.from(data.fileBase64, 'base64')
      const destination = `listings/${userId}/${Date.now()}_${data.fileName.replace(/[^a-zA-Z0-9.\-_]/g, '')}`

      const file = bucket.file(destination)
      await file.save(buffer, {
        metadata: { contentType: data.mimeType },
      })

      try {
         await file.makePublic()
      } catch (e: any) {
         console.warn("[uploadListingImageFn] makePublic failed (safe to ignore if Uniform Access enabled):", e.message)
      }

      const url = `https://storage.googleapis.com/${bucket.name}/${destination}`
      return url
    } catch (error: any) {
      console.error('[uploadListingImageFn] Failed to upload image:', error)
      throw new Error(error.message || 'Image upload failed')
    }
  }
)
