import { type ForwardedRef, forwardRef } from 'react'
import { tv } from 'tailwind-variants'

import type { ButtonProps } from '@/ui/global/widgets/components/Button/types'
import { Button } from '@/ui/global/widgets/components/Button'

const styles = tv({
  base: 'w-64',
  variants: {
    color: {
      green: 'border-gray-100 text-gray-900',
      red: 'bg-red-700 text-gray-100',
    },
  },
})

export type Props = {
  color: 'red' | 'green'
} & ButtonProps

const View = ({ color, ...buttonProps }: Props, ref: ForwardedRef<HTMLButtonElement>) => {
  return <Button ref={ref} {...buttonProps} className={styles({ color })} />
}

export const StyledButtonView = forwardRef(View)
