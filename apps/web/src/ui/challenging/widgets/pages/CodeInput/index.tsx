import type { PropsWithChildren } from 'react'

import { useCodeInput } from './useCodeInput'
import { AnimatedArrow } from '@/ui/global/widgets/components/AnimatedArrow'
import { AnimatedExpandable } from '@/ui/global/widgets/components/AnimatedExpandable'
import { Icon } from '@/ui/global/widgets/components/Icon'

type CodeFieldProps = {
  label: string
  onRemove: VoidFunction
}

export function CodeInput({
  label,
  children,
  onRemove,
}: PropsWithChildren<CodeFieldProps>) {
  const { isContentExpanded, handleArrowClick } = useCodeInput()

  return (
    <div>
      <button
        type='button'
        onClick={onRemove}
        className='flex items-center gap-1 ml-auto mb-1 text-green-400 text-sm'
      >
        <Icon name='close' size={14} />
        Remover parâmetro
      </button>
      <div className='rounded-md border border-gray-500 p-6'>
        <div className='flex justify-between border-b pb-3 border-gray-500'>
          <p className='text-gray-50'>{label}</p>

          <button
            type='button'
            className='grid place-content-center p-2'
            onClick={handleArrowClick}
          >
            <AnimatedArrow isUp={isContentExpanded} />
          </button>
        </div>

        <AnimatedExpandable isExpanded={isContentExpanded} className='mt-6 space-y-6'>
          {children}
        </AnimatedExpandable>
      </div>
    </div>
  )
}
