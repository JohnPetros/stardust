'use client'

import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { Check } from '@phosphor-icons/react'
import * as C from '@radix-ui/react-checkbox'

import { useCheckbox } from './useCheckbox'
import { AnimatedLabel } from './AnimatedLabel'
import { CHECKBOX_STYLES } from './checkbox-styles'
import { AnimatedIndicator } from './AnimatedIndicator'

type CheckboxProps = {
  children: string
  onCheck: () => void
  isChecked: boolean
}

export function Checkbox({ children, onCheck, isChecked }: CheckboxProps) {
  const checkboxRef = useRef<HTMLButtonElement>(null)
  const { style, handleKeydown } = useCheckbox(isChecked, checkboxRef)

  return (
    <AnimatedLabel
      role='checkbox'
      aria-keyshortcuts='Space'
      htmlFor={children}
      onKeyDown={handleKeydown}
      checkboxStyle={style}
    >
      <C.Root
        ref={checkboxRef}
        id={children}
        className={twMerge(
          'h-6 w-6 rounded-md border border-gray-100 bg-transparent',
          CHECKBOX_STYLES[style],
        )}
        onCheckedChange={onCheck}
        tabIndex={-1}
      >
        <C.Indicator className='grid place-content-center'>
          <AnimatedIndicator>
            <Check
              className={twMerge('text-lg text-blue-300', CHECKBOX_STYLES[style])}
              weight='bold'
            />
          </AnimatedIndicator>
        </C.Indicator>
      </C.Root>
      <span className='text-gray-100'>{children}</span>
    </AnimatedLabel>
  )
}
