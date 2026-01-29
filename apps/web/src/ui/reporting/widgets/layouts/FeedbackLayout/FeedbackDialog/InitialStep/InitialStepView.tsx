import { Icon } from '@/ui/global/widgets/components/Icon'
import { twMerge } from 'tailwind-merge'

type Props = {
  onSelectIntent: (intent: string) => void
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

export const InitialStepView = ({ onSelectIntent }: Props) => {
  return (
    <div className='flex flex-col items-center gap-6 py-4'>
      <div className='grid grid-cols-3 gap-3 w-full'>
        {INTENTS.map((intent) => (
          <button
            key={intent.value}
            type='button'
            onClick={() => onSelectIntent(intent.value)}
            className='flex flex-col items-center gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-gray-700 hover:bg-gray-800'
          >
            <div className={twMerge('rounded-full p-2', intent.bgColor)}>
              <Icon name={intent.icon as any} className={intent.color} size={48} />
            </div>
            <span className='text-sm font-semibold text-gray-200'>{intent.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
