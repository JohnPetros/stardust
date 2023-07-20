'use client'
import { InputHTMLAttributes, useId, useState } from 'react'
import { Eye, EyeClosed, Icon } from '@phosphor-icons/react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: Icon
  type: string
}

export function Input({ label, type, icon: Icon, ...rest }: InputProps) {
  const [innerType, setInnerType] = useState(type)
  const id = useId()

  function handleEyeClick() {
    if (innerType === 'password') {
      setInnerType('text')
      return
    }
    setInnerType('password')
  }

  return (
    <label htmlFor={id} className="block">
      <span className="text-green-400 text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2 bg-transparent rounded border border-gray-400 mt-3 p-3 group focus-within:border-green-400">
        <Icon
          className="text-gray-300 group-focus-within:text-green-400"
          width={24}
          height={24}
        />
        <input
          type={innerType}
          id={id}
          {...rest}
          className="w-full bg-inherit outline-none text-gray-100 text-sm"
        />

        {type === 'password' && (
          <button type="button" onClick={handleEyeClick}>
            {innerType === 'password' ? (
              <Eye
                className="text-gray-300 group-focus-within:text-green-400"
                width={24}
                height={24}
              />
            ) : (
              <EyeClosed
                className="text-gray-300 group-focus-within:text-green-400"
                width={24}
                height={24}
              />
            )}
          </button>
        )}
      </div>
    </label>
  )
}
