import type { PropsWithChildren } from 'react'

import type { IconName } from '@/ui/global/widgets/components/Icon/types'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { AnimatedExpandable } from '@/ui/global/widgets/components/AnimatedExpandable'
import { AnimatedArrow } from '@/ui/global/widgets/components/AnimatedArrow'
import { useChallengeField } from './useChallengeField'

type ChallengeFieldProps = {
  title: string
  subtitle?: string
  hasError?: boolean
  icon: IconName
}

export function ChallengeField({
  children,
  title,
  subtitle,
  hasError,
  icon,
}: PropsWithChildren<ChallengeFieldProps>) {
  const { isContentExpanded, handleArrowClick } = useChallengeField()

  return (
    <div className='radius-md'>
      <div className='flex justify-between'>
        <div className='grid place-content-center p-3 bg-green-900 '>
          <Icon name={icon} className={hasError ? 'text-red-700' : 'text-green-400'} />
        </div>
        <h2 className={hasError ? 'text-red-700' : 'text-green-400'}>{title}</h2>
        {subtitle && <p className='text-gray-500 text-sm'>{subtitle}</p>}

        <button
          type='button'
          className='grid place-content-center p-2'
          onClick={handleArrowClick}
        >
          <AnimatedArrow isUp={isContentExpanded} />
        </button>
      </div>

      <AnimatedExpandable isExpanded={isContentExpanded} className='mt-6'>
        {children}
      </AnimatedExpandable>
    </div>
  )
}
