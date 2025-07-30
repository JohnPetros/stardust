import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react'

import {
  useFileUpload,
  type FileUploadOptions,
  formatBytes,
} from '@/ui/shadcn/hooks/use-file-upload'
import { Button } from '@/ui/shadcn/components/button'

export default function FileUpload({
  maxSize = 2 * 1024 * 1024, // 2MB default
  accept = 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
  multiple = true,
  initialFiles = [],
  onFilesAdded,
  onFilesChange,
}: FileUploadOptions) {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept,
    maxSize,
    multiple,
    initialFiles,
    onFilesChange,
    onFilesAdded,
  })
  const previewUrl = files[0]?.preview || null
  const fileName = files[0]?.file.name || null

  return (
    <div className='flex flex-col gap-2'>
      <div className='relative'>
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className='border-input data-[dragging=true]:bg-accent/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-700 p-4 transition-colors '
        >
          <input
            {...getInputProps()}
            className='sr-only'
            aria-label='Upload image file'
          />
          {previewUrl ? (
            <div className='absolute inset-0 flex items-center justify-center p-4'>
              <img
                src={previewUrl}
                alt={files[0]?.file?.name || 'Uploaded image'}
                className='mx-auto max-h-full rounded object-contain'
              />
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
              <div
                className='bg-transparent mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-zinc-700'
                aria-hidden='true'
              >
                <ImageIcon name='image' className='size-4 opacity-60 bg-transparent' />
              </div>
              <p className='mb-1.5 text-sm font-medium'>Drop your image here</p>
              <p className='text-zinc-300 text-xs'>
                SVG, PNG, JPG ou (max. {formatBytes(maxSize)})
              </p>
              <Button variant='outline' className='mt-4' onClick={openFileDialog}>
                <UploadIcon className='-ms-1 size-4 opacity-60' aria-hidden='true' />
                Selecionar imagem
              </Button>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className='absolute top-4 right-4'>
            <button
              type='button'
              className='focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]'
              onClick={() => removeFile(files[0]?.id)}
              aria-label='Remove image'
            >
              <XIcon className='size-4' aria-hidden='true' />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className='text-destructive flex items-center gap-1 text-xs' role='alert'>
          <AlertCircleIcon className='size-3 shrink-0' />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}
