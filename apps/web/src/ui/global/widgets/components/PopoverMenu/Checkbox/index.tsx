'use client'

import { Check } from '@phosphor-icons/react'
import * as C from '@radix-ui/react-checkbox'
import { twMerge } from 'tailwind-merge'
import { AnimatedIndicator } from './AnimatedIndicator'

type CheckboxProps = {
  id: string
  isChecked: boolean
}

export function Checkbox({ id, isChecked }: CheckboxProps) {
  return (
    <C.Root
      className={twMerge(
        'ml-6 h-[18px] w-[18px] rounded-md border-2 border-green-400',
        isChecked ? 'bg-green-400' : ' border-gray-500 bg-transparent',
      )}
      checked={isChecked}
      id={id}
    >
      <AnimatedIndicator>
        <Check className={' text-green-900'} weight='bold' />
      </AnimatedIndicator>
    </C.Root>
  )
}
