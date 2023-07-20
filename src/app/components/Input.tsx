'use client'
import { InputHTMLAttributes, useId } from 'react'
import { Icon } from '@phosphor-icons/react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: Icon
}

export function Input({ label, icon: Icon, ...rest }: InputProps) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id} className="text-green-400 text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-transparent rounded border border-gray-400 mt-3 p-3 group focus-within:border-green-400">
        <Icon
          className="text-gray-300 group-focus-within:text-green-400"
          width={24}
          height={24}
        />
        <input
          type="text"
          id={id}
          {...rest}
          className="w-full bg-inherit outline-none text-gray-100 text-sm"
        />
      </div>
    </div>
  )
}
