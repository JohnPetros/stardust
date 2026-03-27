import { twMerge } from 'tailwind-merge'

import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  title: string
  difficultyLevel: string
  isActive: boolean
  isCompleted: boolean
  shouldShowCompletion: boolean
  onClick: () => void
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  all: 'Todos',
  any: 'Qualquer',
}

export const SidebarChallengeItemView = ({
  title,
  difficultyLevel,
  isActive,
  isCompleted,
  shouldShowCompletion,
  onClick,
}: Props) => {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={`Abrir desafio ${title}`}
      className={twMerge(
        'flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors',
        isActive
          ? 'border-blue-400 bg-blue-950/40'
          : 'border-gray-700 bg-gray-900 hover:bg-gray-800',
      )}
    >
      <div className='flex min-w-0 flex-col'>
        <span
          className={twMerge(
            'truncate text-sm font-medium',
            isActive ? 'text-blue-100' : 'text-gray-100',
          )}
        >
          {title}
        </span>
      </div>

      <div className='ml-3 flex shrink-0 items-center gap-2'>
        <span className='text-xs font-semibold text-gray-300'>
          {DIFFICULTY_LABEL[difficultyLevel] ?? difficultyLevel}
        </span>

        {shouldShowCompletion && (
          <Icon
            name={isCompleted ? 'check' : 'unchecked'}
            size={14}
            className={isCompleted ? 'text-green-400' : 'text-gray-500'}
          />
        )}
      </div>
    </button>
  )
}
