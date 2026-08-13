import type { ChangeEvent } from 'react'

import type { FeedbackDraftAttachment } from '@/ui/reporting/types'

type Params = {
  attachments: FeedbackDraftAttachment[]
  max: number
  onChange: (attachments: FeedbackDraftAttachment[]) => void
}

export function useFeedbackAttachmentsInput({ attachments, max, onChange }: Params) {
  function handleFiles(files: FileList | null) {
    if (!files) return
    const next = [...attachments]
    for (const file of Array.from(files)) {
      if (next.length >= max) break
      if (
        !['image/png', 'image/jpeg'].includes(file.type) ||
        file.size > 10 * 1024 * 1024
      ) {
        continue
      }
      next.push({
        id: `${file.name}-${file.lastModified}-${next.length}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })
    }
    onChange(next)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.currentTarget.files)
    event.currentTarget.value = ''
  }

  function remove(id: string) {
    const attachment = attachments.find((item) => item.id === id)
    if (attachment) URL.revokeObjectURL(attachment.previewUrl)
    onChange(attachments.filter((item) => item.id !== id))
  }

  return { handleInputChange, remove }
}
