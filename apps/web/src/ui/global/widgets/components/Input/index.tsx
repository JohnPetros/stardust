'use client'

import { type ForwardedRef, forwardRef, useId } from 'react'

import { useInput } from './useInput'
import { InputView, type InputProps } from './InputView'

const InputComponent = (
  { type, ...inputProps }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const { handleEyeClick, innerType } = useInput(type)
  const id = useId()

  return (
    <InputView
      {...inputProps}
      ref={ref}
      id={id}
      type={type}
      innerType={innerType}
      onEyeClick={handleEyeClick}
    />
  )
}

export const Input = forwardRef(InputComponent)
