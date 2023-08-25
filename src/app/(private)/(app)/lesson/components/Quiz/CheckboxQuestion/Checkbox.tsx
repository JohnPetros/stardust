import { Check } from '@phosphor-icons/react'
import * as C from '@radix-ui/react-checkbox'

interface CheckboxProps {
  children: string
}

export function Checkbox({ children }: CheckboxProps) {
  return (
    <li className="rounded-md border border-gray-100 bg-purple-700 flex items-center gap-3 p-3 w-full">
      <C.Root
        id={children}
        className="rounded-md border border-gray-100 bg-transparent w-6 h-6"
      >
        <C.Indicator className="CIndicator">
          <Check className="text-blue-300 text-lg" />
        </C.Indicator>
      </C.Root>
      <label htmlFor={children} className="text-gray-100">
        {children}
      </label>
    </li>
  )
}
