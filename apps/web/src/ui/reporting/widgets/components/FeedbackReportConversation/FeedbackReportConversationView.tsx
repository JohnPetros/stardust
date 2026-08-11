import { Icon } from '@/ui/global/widgets/components/Icon'
import { UserAvatar } from '@/ui/global/widgets/components/UserAvatar'
import type {
  FeedbackAuthorAvatarViewModel,
  FeedbackMessageViewModel,
} from './useFeedbackReportConversation'

type Props = {
  messages: FeedbackMessageViewModel[]
  authorAvatar: FeedbackAuthorAvatarViewModel
}

export function FeedbackReportConversationView({ messages, authorAvatar }: Props) {
  return (
    <ol
      aria-label='Conversa do reporte'
      className='flex min-h-0 flex-1 flex-col divide-y divide-gray-800/70 overflow-y-auto rounded-xl border border-gray-800/80 bg-[#0a0d0e]'
    >
      {messages.map((message, index) => (
        <li
          key={message.id ?? `${message.createdAt}-${index}`}
          className='flex gap-3 px-4 py-5 sm:px-5'
        >
          <div className='mt-1 shrink-0' aria-hidden={message.isUser ? undefined : true}>
            {message.isUser ? (
              <UserAvatar
                avatarImage={authorAvatar.image}
                avatarName={authorAvatar.name}
                size={48}
              />
            ) : (
              <div className='flex h-12 w-12 items-center justify-center rounded-full border border-green-500/60 bg-green-500/10'>
                <Icon name='rocket' size={22} className='text-green-400' />
              </div>
            )}
          </div>
          <div className='min-w-0 flex-1'>
            <div className='flex items-start justify-between gap-0'>
              <span className='min-w-0 pt-1 text-sm font-bold text-gray-100'>
                {message.isUser ? 'Você' : 'Equipe StarDust'}
              </span>
              <div className='flex shrink-0 flex-col items-end gap-1'>
                <span
                  className={`rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-wide ${message.isUser ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-green-500/70 bg-green-500/10 text-green-400'}`}
                >
                  {message.isUser ? 'Autor' : 'Equipe'}
                </span>
                <time dateTime={message.createdAt} className='text-[10px] text-gray-500'>
                  {message.formattedTime}
                </time>
              </div>
            </div>
            <p className='text-sm leading-relaxed text-gray-300'>{message.content}</p>
            {message.attachments.length > 0 && (
              <div className='mt-2 flex flex-wrap gap-2'>
                {message.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.href}
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
                      {[attachment.typeLabel, attachment.sizeLabel]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
