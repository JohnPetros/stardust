'use client'

import { type ForwardedRef, forwardRef, type InputHTMLAttributes } from 'react'

import type { IconName } from '../Icon/types/IconName'
import { Icon } from '../Icon'
import { ErrorMessage } from '../ErrorMessage'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  testId?: string
  type: string
  icon?: IconName
  label?: string
  isActive?: boolean
  errorMessage?: string
}

export type InputViewProps = InputProps & {
  id: string
  innerType: string
  onEyeClick: () => void
}

const FOCUS_OUTLINE_CLASS_NAME =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-action'

const InputViewComponent = (
  {
    id,
    label,
    type,
    innerType,
    icon,
    errorMessage,
    isActive = false,
    testId,
    onEyeClick,
    ...inputAttributes
  }: InputViewProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const hasError = Boolean(errorMessage)

  let iconClassName = 'text-theme-text-secondary group-focus-within:text-theme-action'
  if (isActive) iconClassName = 'text-theme-action'
  if (hasError) iconClassName = 'text-theme-danger'

  let fieldClassName =
    'border-theme-border focus-within:border-theme-action focus-within:ring-theme-action'
  if (isActive) fieldClassName = 'border-theme-action focus-within:ring-theme-action'
  if (hasError) fieldClassName = 'border-theme-danger focus-within:ring-theme-danger'

  return (
    <div>
      <label htmlFor={id} className='block'>
        {label && (
          <span
            className={`mb-3 block text-sm font-medium ${
              hasError ? 'text-theme-danger' : 'text-theme-text-primary'
            }`}
          >
            {label}
          </span>
        )}
        <div
          className={`group flex h-theme-control items-center gap-theme-control-gap rounded-theme border-theme-control bg-theme-surface px-theme-control-x focus-within:ring-1 ${fieldClassName}`}
        >
          {icon && <Icon name={icon} className={iconClassName} size={24} />}

          <input
            data-testid={testId}
            id={id}
            type={innerType}
            aria-label={label}
            ref={ref}
            autoFocus={isActive}
            {...inputAttributes}
            className='w-full bg-transparent text-sm text-theme-text-primary outline-none'
          />

          {type === 'password' && (
            <button
              type='button'
              aria-label={innerType === 'password' ? 'Mostrar senha' : 'Ocultar senha'}
              onClick={onEyeClick}
              className={`rounded-theme ${FOCUS_OUTLINE_CLASS_NAME}`}
            >
              <Icon
                name={innerType === 'password' ? 'eye' : 'eye-closed'}
                className={iconClassName}
                size={24}
              />
            </button>
          )}
        </div>
      </label>

      {errorMessage && <ErrorMessage className='mt-3'>{errorMessage}</ErrorMessage>}
    </div>
  )
}

export const InputView = forwardRef(InputViewComponent)
