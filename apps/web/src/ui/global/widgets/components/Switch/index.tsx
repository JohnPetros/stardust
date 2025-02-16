'use client'
import { useId } from 'react'
import { Root, Thumb } from '@radix-ui/react-switch'
import { twMerge } from 'tailwind-merge'

import { useSwitch } from './useSwitch'

type SwitchProps = {
  label: string
  name?: string
  value?: string
  defaultCheck?: boolean
  isDisabled?: boolean
  onCheck: (isChecked: boolean) => void
}

export function Switch({
  onCheck,
  label,
  name,
  value,
  defaultCheck = false,
  isDisabled = false,
}: SwitchProps) {
  const { isChecked, handleCheckChange } = useSwitch(defaultCheck, onCheck)
  const id = useId()

  return (
    <div
      className={twMerge(
        'flex items-center justify-center gap-1 px-3 py-2 border border-gray-500 rounded-full',
        isDisabled ? 'pointer-events-none' : '',
      )}
    >
      <label
        htmlFor={id}
        className={twMerge(
          'cursor-pointer text-sm text-gray-100',
          isChecked ? 'opacity-1' : 'opacity-50',
        )}
      >
        {label}
      </label>

      <Root
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        onCheckedChange={handleCheckChange}
        className='h-4 w-8 rounded-lg bg-gray-600'
      >
        <Thumb
          className={twMerge(
            'block size-4 rounded-full transition-transform',
            isChecked ? 'translate-x-4 bg-green-400' : 'bg-green-700',
          )}
        />
      </Root>
    </div>
  )
}
