import { CircleUserRoundIcon, XIcon } from 'lucide-react'

import { useFileUpload } from '@/ui/shadcn/hooks/use-file-upload'
import { Button } from '@/ui/shadcn/components/button'

type Props = {
  defaultFile?: File
  onChange(imageFile: File): void
}

export function ImageFileUpload({ onChange, defaultFile }: Props) {
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: 'image/*',
    initialFiles: defaultFile
      ? [
          {
            id: defaultFile.name,
            name: defaultFile.name,
            size: defaultFile.size,
            type: defaultFile.type,
            url: URL.createObjectURL(defaultFile),
          },
        ]
      : [],
    onFilesChange: (files) => onChange(files[0]),
  })

  const previewUrl = files[0]?.preview || null

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='relative inline-flex'>
        {/* Drop area */}
        <button
          className='relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed border-input transition-colors outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none data-[dragging=true]:bg-accent/50'
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={previewUrl ? 'Change image' : 'Upload image'}
        >
          {previewUrl ? (
            <img
              className='size-full object-cover'
              src={previewUrl}
              alt={files[0]?.file?.name || 'Uploaded image'}
              width={64}
              height={64}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div aria-hidden='true'>
              <CircleUserRoundIcon className='size-4 opacity-60' />
            </div>
          )}
        </button>
        {previewUrl && (
          <Button
            onClick={() => removeFile(files[0]?.id)}
            size='icon'
            className='absolute -top-1 -right-1 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background'
            aria-label='Remove image'
          >
            <XIcon className='size-3.5' />
          </Button>
        )}
        <input
          {...getInputProps()}
          className='sr-only'
          aria-label='Upload image file'
          tabIndex={-1}
        />
      </div>
      <p aria-live='polite' role='region' className='mt-2 text-xs text-muted-foreground'>
        Avatar uploader with droppable area ∙{' '}
        <a
          href='https://github.com/cosscom/coss/blob/main/apps/origin/docs/use-file-upload.md'
          className='underline hover:text-foreground'
        >
          API
        </a>
      </p>
    </div>
  )
}
