import { tv } from 'tailwind-variants'

import type { ButtonProps } from '@/ui/global/components/shared/Button/types'
import { Button } from '@/ui/global/components/shared/Button'

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

export function StyledButton({ color, ...buttonProps }: StyledButtonProps) {
  return <Button {...buttonProps} className={buttonStyles({ color })} />
}
