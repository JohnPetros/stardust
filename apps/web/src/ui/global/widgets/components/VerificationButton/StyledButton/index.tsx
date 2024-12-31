import { type ForwardedRef, forwardRef } from 'react'
import { tv } from 'tailwind-variants'

import type { ButtonProps } from '@/ui/global/widgets/components/Button/types'
import { Button } from '@/ui/global/widgets/components/Button'

const buttonStyles = tv({
  base: 'w-64',
  variants: {
    color: {
      green: 'border-gray-100 text-gray-900',
      red: 'bg-red-700 text-gray-100',
    },
  },
})

export type StyledButtonProps = {
  color: 'red' | 'green'
} & ButtonProps

const StyledButtonComponent = (
  { color, ...buttonProps }: StyledButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) => {
  return <Button ref={ref} {...buttonProps} className={buttonStyles({ color })} />
}

export const StyledButton = forwardRef(StyledButtonComponent)
