import Image from 'next/image'
import { Icon } from '@/ui/global/widgets/components/Icon'
import type { FeedbackDraftAttachment } from '@/ui/reporting/types'

type Props = {
  attachments: FeedbackDraftAttachment[]
  max: number
  onChange: (attachments: FeedbackDraftAttachment[]) => void
  disabled?: boolean
  label?: string
}

export function FeedbackAttachmentsInputView({
  attachments,
  max,
  onChange,
  disabled = false,
  label = 'Anexar imagens',
}: Props) {
  function handleFiles(files: FileList | null) {
    if (!files) return
    const next = [...attachments]
    for (const file of Array.from(files)) {
      if (next.length >= max) break
      if (
        !['image/png', 'image/jpeg'].includes(file.type) ||
        file.size > 10 * 1024 * 1024
      )
        continue
      next.push({
        id: `${file.name}-${file.lastModified}-${next.length}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })
    }
    onChange(next)
  }

  function remove(id: string) {
    const attachment = attachments.find((item) => item.id === id)
    if (attachment) URL.revokeObjectURL(attachment.previewUrl)
    onChange(attachments.filter((item) => item.id !== id))
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <span className='text-xs font-semibold uppercase tracking-[0.16em] text-gray-500'>
          {label}
        </span>
        <span className='text-[11px] text-gray-600'>
          {attachments.length}/{max}
        </span>
      </div>
      <div className='flex flex-wrap gap-2'>
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className='group relative h-16 w-16 overflow-hidden rounded-lg border border-gray-700 bg-gray-950'
          >
            <Image
              src={attachment.previewUrl}
              alt={attachment.file.name}
              fill
              unoptimized
              className='object-cover'
            />
            <button
              type='button'
              aria-label={`Remover ${attachment.file.name}`}
              onClick={() => remove(attachment.id)}
              className='absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-950/90 text-gray-200 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100'
            >
              <Icon name='close' size={12} />
            </button>
          </div>
        ))}
        {attachments.length < max && (
          <label className='flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-700 bg-gray-900/60 text-gray-500 transition hover:border-green-500 hover:text-green-400 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-green-400'>
            <Icon name='plus' size={18} />
            <span className='sr-only'>{label}</span>
            <input
              type='file'
              accept='image/png,image/jpeg'
              multiple={max > 1}
              disabled={disabled}
              onChange={(event) => {
                handleFiles(event.target.files)
                event.currentTarget.value = ''
              }}
              className='sr-only'
            />
          </label>
        )}
      </div>
      <p className='text-[11px] leading-relaxed text-gray-600'>
        PNG ou JPEG · até 10 MB por imagem
      </p>
    </div>
  )
}
