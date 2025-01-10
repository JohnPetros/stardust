import type { PropsWithChildren } from 'react'

import { useCodeInput } from './useCodeInput'
import { AnimatedArrow } from '@/ui/global/widgets/components/AnimatedArrow'
import { AnimatedExpandable } from '@/ui/global/widgets/components/AnimatedExpandable'

type CodeFieldProps = {
  label: string
}

export function CodeInput({ label, children }: PropsWithChildren<CodeFieldProps>) {
  const { isContentExpanded, handleArrowClick } = useCodeInput()

  return (
    <div className='radius-md border border-gray-500'>
      <div className='flex justify-between border-b border-gray-500'>
        <p>{label}</p>

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
