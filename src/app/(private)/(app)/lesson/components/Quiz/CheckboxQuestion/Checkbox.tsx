import { Check } from '@phosphor-icons/react'
import * as C from '@radix-ui/react-checkbox'

interface CheckboxProps {
  children: string
}

export function Checkbox({ children }: CheckboxProps) {
  return (
    <li className="rounded-md border border-gray-100 bg-purple-700">
      <label htmlFor={children} className='flex items-center  p-3 w-full gap-3 cursor-pointer'>
        <C.Root
          id={children}
          className="rounded-md border border-gray-100 bg-transparent w-6 h-6"
        >
          <C.Indicator className="grid place-content-center">
            <Check className="text-blue-300 text-lg" />
          </C.Indicator>
        </C.Root>
        <span className="text-gray-100">{children}</span>
      </label>
    </li>
  )
}
