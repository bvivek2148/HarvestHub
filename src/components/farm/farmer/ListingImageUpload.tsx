import { useState, useRef } from 'react'
import { Camera, Loader2, X, Image as ImageIcon } from 'lucide-react'
import { C } from './FarmerTypes'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { uploadListingImageFn } from '@/server/functions/storage'

interface Props {
  initialUrl?: string
  onUpload: (url: string) => void
}

export function ListingImageUpload({ initialUrl, onUpload }: Props) {
  const [url, setUrl] = useState(initialUrl || '')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const uploadImage = useServerFn(uploadListingImageFn)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large. Max 5MB.')
      return
    }

    setUploading(true)

    try {
      // Convert file to base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          // Remove the data:image/png;base64, prefix
          const base64 = result.split(',')[1]
          resolve(base64)
        }
        reader.onerror = error => reject(error)
      })
      
      reader.readAsDataURL(file)
      const fileBase64 = await base64Promise

      // Upload via secure server function
      const downloadUrl = await (uploadImage as any)({
        data: {
          fileBase64,
          fileName: file.name,
          mimeType: file.type
        }
      })

      setUrl(downloadUrl)
      onUpload(downloadUrl)
      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      console.error('[ListingImageUpload] Upload failed:', error)
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`)
    } finally {
      setUploading(false)
      // Reset input value so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = () => {
    setUrl('')
    onUpload('')
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>
        Product Photo
      </label>
      
      <div 
        className="relative aspect-video rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all border-2 border-dashed group"
        style={{ 
          background: C.surface2, 
          borderColor: url ? C.green + '40' : C.border,
        }}
        onClick={() => !url && !uploading && fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: C.green }} />
            <span className="text-[10px] font-medium" style={{ color: C.muted }}>Uploading…</span>
          </div>
        ) : url ? (
          <>
            <img src={url} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                className="p-2 rounded-full bg-red-500/20 backdrop-blur-md hover:bg-red-500/40 transition-colors"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
            <div className="w-10 h-10 rounded-full bg-theme-green/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" style={{ color: C.green }} />
            </div>
            <div className="text-center">
                <p className="text-xs font-bold" style={{ color: C.text }}>Click to upload</p>
                <p className="text-[10px]" style={{ color: C.muted }}>JPG, PNG or WEBP (Max 5MB)</p>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}
