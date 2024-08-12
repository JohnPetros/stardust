'use client'

import { ForwardedRef, InputHTMLAttributes, forwardRef, useId } from 'react'

import type { IconName } from '../Icon/types/IconName'
import { Icon } from '../Icon'
import { useInput } from './useInput'
import { twMerge } from 'tailwind-merge'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon: IconName
  type: string
  isActive?: boolean
  error?: string
}

const InputComponent = (
  { label, type, icon, error, isActive = false, ...inputAttributes }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const { handleEyeClick, innerType } = useInput(type)
  const id = useId()

  let iconClassName = error
    ? 'text-red-700'
    : 'text-gray-300 group-focus-within:text-green-400'

  iconClassName += isActive ? ' text-green-400' : ''

  return (
    <>
      <label htmlFor={id} className='block'>
        <span
          className={twMerge(
            'text-sm font-medium',
            error ? 'text-red-700' : 'text-green-400'
          )}
        >
          {label}
        </span>
        <div
          className={twMerge(
            'flex items-center gap-2 rounded border bg-transparent group mt-3 p-3',
            error ? 'border-red-700' : 'border-gray-400 focus-within:border-green-400',
            isActive && 'border-green-400'
          )}
        >
          <Icon name={icon} className={iconClassName} size={24} />

          <input
            id={id}
            type={innerType}
            aria-label={label}
            ref={ref}
            autoFocus={isActive}
            {...inputAttributes}
            className='w-full bg-transparent text-sm text-gray-100 outline-none'
          />

          {type === 'password' && (
            <button type='button' onClick={handleEyeClick}>
              {innerType === 'password' ? (
                <Icon name='eye' className={iconClassName} size={24} />
              ) : (
                <Icon name='eye-closed' className={iconClassName} size={24} />
              )}
            </button>
          )}
        </div>
      </label>

      {error && <span className='text-sm font-medium text-red-700'>{error}</span>}
    </>
  )
}

export const Input = forwardRef(InputComponent)
