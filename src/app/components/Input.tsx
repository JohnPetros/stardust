'use client'
import {
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
  useId,
  useState,
} from 'react'
import { Eye, EyeClosed, Icon } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: Icon
  type: string
  error: string | undefined
}

const InputComponent = (
  { label, type, icon: Icon, error, ...rest }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [innerType, setInnerType] = useState(type)
  const id = useId()
  const iconColor = error
    ? 'text-red-700'
    : 'text-gray-300 group-focus-within:text-green-400'

  function handleEyeClick() {
    if (innerType === 'password') {
      setInnerType('text')
      return
    }
    setInnerType('password')
  }

  return (
    <>
      <label htmlFor={id} className="block">
        <span
          className={`${
            error ? 'text-red-700' : 'text-green-400'
          } text-sm font-medium"} text-sm font-medium`}
        >
          {label}
        </span>
        <div
          className={`flex items-center gap-2 bg-transparent rounded border ${
            error
              ? 'border-red-700'
              : 'border-gray-400 focus-within:border-green-400'
          }  mt-3 p-3 group`}
        >
          <Icon className={iconColor} width={24} height={24} />
          <input
            ref={ref}
            type={innerType}
            id={id}
            {...rest}
            className="w-full bg-inherit outline-none text-gray-100 text-sm"
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
        <span className="text-red-700 text-sm font-medium">{error}</span>
      )}
    </>
  )
}

export const Input = forwardRef(InputComponent)
