import { Icon } from '@/ui/global/widgets/components/Icon'
import { FeedbackUnreadBadge } from '@/ui/reporting/widgets/components/FeedbackUnreadBadge'
import { twMerge } from 'tailwind-merge'

type Props = {
  onSelectIntent: (intent: string) => void
  onOpenHistory?: () => void
  unreadCount: number
}

const INTENTS = [
  {
    value: 'bug',
    label: 'Problema',
    icon: 'bug',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    value: 'idea',
    label: 'Ideia',
    icon: 'lightbulb',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
  },
  {
    value: 'other',
    label: 'Outro',
    icon: 'comment',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
]

export const InitialStepView = ({
  onSelectIntent,
  onOpenHistory,
  unreadCount,
}: Props) => {
  return (
    <div className='flex flex-col items-center gap-5 py-2'>
      <div className='grid w-full grid-cols-3 gap-3'>
        {INTENTS.map((intent) => (
          <button
            key={intent.value}
            type='button'
            onClick={() => onSelectIntent(intent.value)}
            className='flex flex-col items-center gap-4 rounded-lg border-0 bg-[#1f2728] p-5 transition-all hover:bg-[#263031]'
          >
            <div className={twMerge('rounded-full p-2', intent.bgColor)}>
              <Icon name={intent.icon as any} className={intent.color} size={48} />
            </div>
            <span className='text-sm font-semibold text-gray-200'>{intent.label}</span>
          </button>
        ))}
      </div>
      {onOpenHistory && (
        <button
          type='button'
          onClick={onOpenHistory}
          className='flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-gray-600 text-xs font-semibold text-gray-200 transition-colors hover:border-gray-400 hover:bg-[#1f2728]'
        >
          <Icon name='history' size={15} className='text-gray-300' />
          Ver meus reportes
          <FeedbackUnreadBadge count={unreadCount} />
        </button>
      )}
    </div>
  )
}
