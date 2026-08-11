import { useMemo } from 'react'

import type { FeedbackReportDetailsDto } from '@stardust/core/reporting/entities/dtos'
import type { FeedbackMessage } from '@/ui/reporting/types'

type Params = { detail: FeedbackReportDetailsDto; cdnUrl?: string }

type FeedbackAttachmentViewModel = FeedbackMessage['attachments'][number] & {
  href: string
  typeLabel: string
  sizeLabel: string
}

export type FeedbackMessageViewModel = Omit<FeedbackMessage, 'attachments'> & {
  isUser: boolean
  formattedTime: string
  attachments: FeedbackAttachmentViewModel[]
}

export type FeedbackAuthorAvatarViewModel = {
  name: string
  image: string
}

function attachmentUrl(storageKey: string, cdnUrl?: string) {
  if (/^https?:\/\//.test(storageKey)) return storageKey
  return cdnUrl ? `${cdnUrl.replace(/\/$/, '')}/${storageKey}` : storageKey
}

function formatAttachmentSize(size: number) {
  if (!size) return ''
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function formatTime(value?: string) {
  if (!value) return ''
  return new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(new Date(value))
}

export function useFeedbackReportConversation({ detail, cdnUrl }: Params) {
  const authorAvatar = useMemo<FeedbackAuthorAvatarViewModel>(
    () =>
      detail.author.entity?.avatar ?? {
        name: 'Você',
        image: '/images/profile.svg',
      },
    [detail.author.entity],
  )

  const messages = useMemo<FeedbackMessageViewModel[]>(() => {
    const initialMessage: FeedbackMessage = {
      id: 'initial-report',
      reportId: detail.id ?? '',
      authorRole: 'user',
      authorId: detail.author.id,
      content: detail.content,
      createdAt: detail.createdAt ?? detail.sentAt,
      attachments: detail.screenshot
        ? [
            {
              id: 'initial-image',
              storageKey: detail.screenshot,
              originalName: 'imagem do relato',
              mimeType: 'image/png',
              size: 0,
            },
          ]
        : [],
    }

    return [initialMessage, ...detail.messages].map((message) => ({
      ...message,
      isUser: message.authorRole === 'user',
      formattedTime: formatTime(message.createdAt),
      attachments: message.attachments.map((attachment) => ({
        ...attachment,
        href: attachmentUrl(attachment.storageKey, cdnUrl),
        typeLabel: attachment.mimeType.split('/').at(-1)?.toUpperCase() ?? '',
        sizeLabel: formatAttachmentSize(attachment.size),
      })),
    }))
  }, [cdnUrl, detail])

  return { authorAvatar, messages }
}
