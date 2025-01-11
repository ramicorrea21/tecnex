'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X, Upload } from 'lucide-react'

interface ProductImagesUploadProps {
  existingImages?: string[]
  onImagesChange: (files: File[], existingImages: string[]) => void
  disabled?: boolean
}

export function ProductImagesUpload({ 
  existingImages = [], 
  onImagesChange,
  disabled
}: ProductImagesUploadProps) {
  const [newImages, setNewImages] = useState<File[]>([])
  const [keepExisting, setKeepExisting] = useState<string[]>(existingImages)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setNewImages(prev => {
        const updated = [...prev, ...files]
        onImagesChange(updated, keepExisting)
        return updated
      })
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files)
      setNewImages(prev => {
        const updated = [...prev, ...files]
        onImagesChange(updated, keepExisting)
        return updated
      })
    }
  }, [onImagesChange, keepExisting])

  const removeNewImage = (index: number) => {
    setNewImages(prev => {
      const updated = prev.filter((_, i) => i !== index)
      onImagesChange(updated, keepExisting)
      return updated
    })
  }

  const removeExistingImage = (url: string) => {
    setKeepExisting(prev => {
      const updated = prev.filter(img => img !== url)
      onImagesChange(newImages, updated)
      return updated
    })
  }

  return (
    <div className="space-y-4">
      {/* Área de drop y selección */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center",
          "hover:bg-muted/50 transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            Arrastra imágenes aquí o
            <Button 
              variant="link" 
              className="px-1"
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('image-upload')?.click()
              }}
            >
              selecciona archivos
            </Button>
          </div>
        </div>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Preview de imágenes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Imágenes existentes */}
        {keepExisting.map((url, index) => (
          <div key={url} className="relative aspect-square group">
            <Image
              src={url}
              alt={`Imagen existente ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeExistingImage(url)}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {/* Imágenes nuevas */}
        {newImages.map((file, index) => (
          <div key={index} className="relative aspect-square group">
            <Image
              src={URL.createObjectURL(file)}
              alt={`Nueva imagen ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeNewImage(index)}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}