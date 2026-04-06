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
}

export const SidebarChallengeItemView = ({
  title,
  difficultyLevel,
  isActive,
  isCompleted,
  shouldShowCompletion,
  onClick,
}: Props) => {
  const difficultyColorByLevel: Record<string, string> = {
    easy: 'text-emerald-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400',
  }

  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={`Abrir desafio ${title}`}
      className={twMerge(
        'flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors',
        isActive
          ? 'border-emerald-500/40 bg-emerald-950/20'
          : 'border-gray-800 bg-[#071118] hover:bg-[#0b1720]',
      )}
    >
      <div className='flex min-w-0 items-start gap-2'>
        {shouldShowCompletion && (
          <span
            className={twMerge(
              'inline-flex h-3.5 w-3.5 shrink-0 self-center items-center justify-center rounded-full border',
              isCompleted
                ? 'border-emerald-400 text-emerald-400'
                : 'border-gray-500 text-transparent',
            )}
          >
            <Icon name='check' size={9} weight='bold' />
          </span>
        )}

        {!shouldShowCompletion && (
          <span className='inline-flex h-3.5 w-3.5 shrink-0 self-center rounded-full border border-gray-500' />
        )}

        <div className='flex min-w-0 flex-col'>
          <span
            className={twMerge(
              'truncate text-sm font-medium',
              isActive ? 'text-emerald-100' : 'text-gray-100',
            )}
          >
            {title}
          </span>

          <span className='text-xs text-gray-500'>
            <span className={difficultyColorByLevel[difficultyLevel] ?? 'text-gray-300'}>
              {DIFFICULTY_LABEL[difficultyLevel] ?? difficultyLevel}
            </span>
          </span>
        </div>
      </div>

      <Icon name='simple-arrow-right' size={14} className='ml-3 shrink-0 text-gray-500' />
    </button>
  )
}
