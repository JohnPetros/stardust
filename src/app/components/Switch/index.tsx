'use client'
import { useId } from 'react'
import { Root, Thumb } from '@radix-ui/react-switch'
import { twMerge } from 'tailwind-merge'

import { useSwitch } from './useSwitch'

type SwitchProps = {
  label: string
  name: string
  value?: string
  onCheck: (isChecked: boolean) => void
}

export function Switch({ onCheck, label, name, value }: SwitchProps) {
  const { isChecked, handleCheckChange, handleLabelClick } = useSwitch(onCheck)
  const id = useId()

  return (
    <div className="flex items-center justify-center gap-2">
      <label
        htmlFor={id}
        className="cursor-pointer text-sm text-gray-100"
        onClick={handleLabelClick}
      >
        {label}
      </label>

      <Root
        id={id}
        name={name}
        value={value}
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
