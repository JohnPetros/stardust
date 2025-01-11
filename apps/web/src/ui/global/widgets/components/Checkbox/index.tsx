'use client'

import * as C from '@radix-ui/react-checkbox'
import { twMerge } from 'tailwind-merge'

import { AnimatedIndicator } from './AnimatedIndicator'
import { Icon } from '../Icon'

type CheckboxProps = {
  id: string
  isChecked?: boolean
  onChange?: (isChecked: boolean) => void
}

export function Checkbox({ id, isChecked, onChange }: CheckboxProps) {
  return (
    <C.Root
      className={twMerge(
        'ml-6 h-[18px] w-[18px] rounded-md border-2 border-green-400',
        isChecked ? 'bg-green-400' : ' border-gray-500 bg-transparent',
      )}
      checked={isChecked}
      onCheckedChange={onChange}
      id={id}
    >
      <AnimatedIndicator>
        <Icon name='check' className='text-green-900' weight='bold' />
      </AnimatedIndicator>
    </C.Root>
  )
}
