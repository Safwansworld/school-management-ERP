import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CameraIcon, UploadIcon, XIcon } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File, url: string) => void
  currentImage?: string
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImage }) => {
  const [preview, setPreview] = useState<string>(currentImage || '')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      onImageSelect(file, url)
    }
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  })

  const removeImage = () => {
    setPreview('')
    onImageSelect(null as any, '')
  }

  return (
    <div className="flex flex-col items-center">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Profile preview"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
          >
            <XIcon className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors duration-200 ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <CameraIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        📸 Click to upload or drag & drop<br />
        Max size: 5MB
      </p>
    </div>
  )
}
