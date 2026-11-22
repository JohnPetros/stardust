import { twMerge } from 'tailwind-merge'

import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'

import type { StarDetails } from './useStarDetails'

export type Props = {
  details: StarDetails | null
  isPending: boolean
  variant?: 'card' | 'flat'
  onAction: () => void
}

function StarDetailsChips({ details }: { details: StarDetails }) {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='flex items-center gap-1.5 rounded-theme-full bg-theme-background px-3 py-1 text-xs font-medium text-theme-text-primary'>
        <span aria-hidden='true' className='inline-flex'>
          <Icon name={details.isChallenge ? 'code' : 'book'} size={14} />
        </span>
        {details.typeLabel}
      </span>
      <span
        className={twMerge(
          'flex items-center gap-1.5 rounded-theme-full border px-3 py-1 text-xs font-medium',
          details.isCompleted
            ? 'border-theme-success bg-theme-success-surface text-theme-success'
            : 'border-theme-reward text-theme-reward',
        )}
      >
        {details.isCompleted && (
          <span aria-hidden='true' className='inline-flex'>
            <Icon name='check' size={14} />
          </span>
        )}
        {details.stateLabel}
      </span>
    </div>
  )
}

export function StarDetailsView({
  details,
  isPending,
  variant = 'card',
  onAction,
}: Props) {
  if (!details) return null

  return (
    <section
      aria-label='Detalhes da estrela'
      className={twMerge(
        'flex w-full flex-col gap-4 p-6',
        variant === 'card' &&
          'rounded-theme border border-theme-border-quiet bg-theme-surface',
      )}
    >
      <p
        className={twMerge(
          'text-xs font-medium text-theme-text-secondary',
          variant === 'flat' && 'pr-12',
        )}
      >
        {details.caption}
      </p>
      <h2 className='text-xl font-semibold text-theme-text-primary lg:text-2xl'>
        {details.name}
      </h2>
      <StarDetailsChips details={details} />
      {details.description && (
        <p className='text-sm text-theme-text-secondary'>{details.description}</p>
      )}
      <Button
        testId='star-details-action'
        onClick={onAction}
        isLoading={isPending}
        className='h-11 gap-theme-control-gap'
      >
        <span aria-hidden='true' className='inline-flex'>
          <Icon name='start' size={18} />
        </span>
        {details.actionLabel}
      </Button>
    </section>
  )
}
