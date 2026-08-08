import { Icon } from '@/ui/global/widgets/components/Icon'
import { UserAvatar } from '@/ui/global/widgets/components/UserAvatar'
import type { FeedbackReportDetailsDto } from '@stardust/core/reporting/entities/dtos'
import type { FeedbackMessage } from '@/ui/reporting/types'

type Props = { detail: FeedbackReportDetailsDto; cdnUrl?: string }

function formatTime(value?: string) {
  if (!value) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    timeStyle: 'short',
  }).format(new Date(value))
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

export function FeedbackReportConversationView({ detail, cdnUrl }: Props) {
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
  const messages = [initialMessage, ...detail.messages]
  const authorAvatar = detail.author.entity?.avatar
  const hasAuthorAvatar =
    Boolean(authorAvatar?.image) &&
    authorAvatar?.image !== '/images/profile.svg' &&
    authorAvatar?.image !== '/icons/profile.svg'

  return (
    <ol
      aria-label='Conversa do reporte'
      className='flex min-h-0 flex-1 flex-col divide-y divide-gray-800/70 overflow-y-auto rounded-xl border border-gray-800/80 bg-[#0a0d0e]'
    >
      {messages.map((message, index) => {
        const isUser = message.authorRole === 'user'
        return (
          <li
            key={message.id ?? `${message.createdAt}-${index}`}
            className='flex gap-3 px-4 py-5 sm:px-5'
          >
            <div className='mt-1 shrink-0' aria-hidden={isUser ? undefined : true}>
              {isUser ? (
                <div className='relative h-12 w-12'>
                  <div className='absolute inset-0 flex items-center justify-center rounded-full border border-gray-700 bg-gray-800'>
                    <Icon name='person' size={22} className='text-gray-400' />
                  </div>
                  {authorAvatar && hasAuthorAvatar && (
                    <UserAvatar
                      avatarImage={authorAvatar.image}
                      avatarName={authorAvatar.name}
                      size={48}
                    />
                  )}
                </div>
              ) : (
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border ${isUser ? 'border-gray-700 bg-gray-800' : 'border-green-500/60 bg-green-500/10'}`}
                >
                  <Icon
                    name={isUser ? 'person' : 'rocket'}
                    size={22}
                    className={isUser ? 'text-gray-400' : 'text-green-400'}
                  />
                </div>
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <div className='flex items-start justify-between gap-3'>
                <span className='min-w-0 pt-1 text-sm font-bold text-gray-100'>
                  {isUser ? 'Você' : 'Equipe StarDust'}
                </span>
                <div className='flex shrink-0 flex-col items-end gap-1'>
                  <span
                    className={`rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-wide ${isUser ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-green-500/70 bg-green-500/10 text-green-400'}`}
                  >
                    {isUser ? 'Autor' : 'Equipe'}
                  </span>
                  <time
                    dateTime={message.createdAt}
                    className='text-[10px] text-gray-500'
                  >
                    {formatTime(message.createdAt)}
                  </time>
                </div>
              </div>
              <p className='mt-2 text-sm leading-relaxed text-gray-300'>
                {message.content}
              </p>
              {message.attachments.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-2'>
                  {message.attachments.map((attachment) => {
                    const attachmentSize = formatAttachmentSize(attachment.size)
                    const attachmentType = attachment.mimeType
                      .split('/')
                      .at(-1)
                      ?.toUpperCase()

                    return (
                      <a
                        key={attachment.id}
                        href={attachmentUrl(attachment.storageKey, cdnUrl)}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/80 px-2.5 py-1.5 text-left transition-colors hover:border-gray-500 hover:bg-gray-800'
                        aria-label={`Abrir anexo ${attachment.originalName}`}
                      >
                        <Icon name='file' size={15} className='shrink-0 text-gray-400' />
                        <span className='truncate text-xs font-medium text-gray-200'>
                          {attachment.originalName}
                        </span>
                        <span className='shrink-0 text-[10px] uppercase text-gray-500'>
                          {[attachmentType, attachmentSize].filter(Boolean).join(' · ')}
                        </span>
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
