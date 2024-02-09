'use client'
import { useId } from 'react'
import { Root, Thumb } from '@radix-ui/react-switch'
import { twMerge } from 'tailwind-merge'

import { useSwitch } from './useSwitch'

type SwitchProps = {
  label: string
  name: string
  value: string
  defaultCheck?: boolean
  onCheck: (isChecked: boolean) => void
}

export function Switch({
  onCheck,
  label,
  name,
  value,
  defaultCheck = false,
}: SwitchProps) {
  const { isChecked, handleCheckChange } = useSwitch(defaultCheck, onCheck)
  const id = useId()

  return (
    <div className="flex items-center justify-center gap-2">
      <label
        htmlFor={id}
        className={twMerge(
          'cursor-pointer text-sm text-gray-100',
          isChecked ? 'opacity-1' : 'opacity-50'
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
        className="h-6 w-10 rounded-lg bg-gray-800 p-1"
      >
        <Thumb
          className={twMerge(
            'block h-4 w-4 rounded-full transition-transform',
            isChecked ? 'translate-x-4 bg-green-400' : 'bg-green-800'
          )}
        />
      </Root>
    </div>
  )
}
