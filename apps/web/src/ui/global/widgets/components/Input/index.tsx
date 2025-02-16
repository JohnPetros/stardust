'use client'

import { type ForwardedRef, type InputHTMLAttributes, forwardRef, useId } from 'react'

import type { IconName } from '../Icon/types/IconName'
import { Icon } from '../Icon'
import { useInput } from './useInput'
import { twMerge } from 'tailwind-merge'
import { ErrorMessage } from '../ErrorMessage'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  type: string
  icon?: IconName
  label?: string
  isActive?: boolean
  errorMessage?: string
}

const InputComponent = (
  { label, type, icon, errorMessage, isActive = false, ...inputAttributes }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const { handleEyeClick, innerType } = useInput(type)
  const id = useId()

  let iconClassName = errorMessage
    ? 'text-red-700'
    : 'text-gray-300 group-focus-within:text-green-400'

  iconClassName += isActive ? ' text-green-400' : ''

  return (
    <div>
      <label htmlFor={id} className='block'>
        {label && (
          <span
            className={twMerge(
              'block text-sm font-medium mb-3',
              errorMessage ? 'text-red-700' : 'text-gray-100 focus-within:text-green-400',
            )}
          >
            {label}
          </span>
        )}
        <div
          className={twMerge(
            'flex items-center gap-2 rounded border bg-transparent group p-3',
            errorMessage
              ? 'border-red-700'
              : 'border-gray-400 focus-within:border-green-400',
            isActive && 'border-green-400',
          )}
        >
          {icon && <Icon name={icon} className={iconClassName} size={24} />}

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

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </div>
  )
}

export const Input = forwardRef(InputComponent)
