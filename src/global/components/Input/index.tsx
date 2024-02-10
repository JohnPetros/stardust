'use client'

import { ForwardedRef, forwardRef, InputHTMLAttributes, useId } from 'react'
import { Eye, EyeClosed, Icon } from '@phosphor-icons/react'

import { useInput } from './useInput'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: Icon
  type: string
  error?: string
}

const InputComponent = (
  { label, type, icon: Icon, error, ...rest }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const { handleEyeClick, innerType } = useInput(type)
  const id = useId()
  const iconColor = error
    ? 'text-red-700'
    : 'text-gray-300 group-focus-within:text-green-400'

  return (
    <>
      <label htmlFor={id} className="block">
        <span
          className={`${
            error ? 'text-red-700' : 'text-green-400'
          } font-medium"} text-sm text-sm font-medium`}
        >
          {label}
        </span>
        <div
          className={`flex items-center gap-2 rounded border bg-transparent ${
            error
              ? 'border-red-700'
              : 'border-gray-400 focus-within:border-green-400'
          }  group mt-3 p-3`}
        >
          <Icon className={iconColor} width={24} height={24} />
          <input
            ref={ref}
            type={innerType}
            id={id}
            {...rest}
            className="w-full bg-transparent text-sm text-gray-100 outline-none"
          />

          {type === 'password' && (
            <button type="button" onClick={handleEyeClick}>
              {innerType === 'password' ? (
                <Eye className={iconColor} width={24} height={24} />
              ) : (
                <EyeClosed className={iconColor} width={24} height={24} />
              )}
            </button>
          )}
        </div>
      </label>
      {error && (
        <span className="text-sm font-medium text-red-700">{error}</span>
      )}
    </>
  )
}

export const Input = forwardRef(InputComponent)
