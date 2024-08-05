'use client'

import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import type { InputBackground } from '../InputBackground'

const inputStyles = tv({
  base: ' rounded-md border-2 overflow-hidden custom-outline',
  variants: {
    background: {
      gray: 'border-gray-100 text-gray-100',
      red: 'border-red-700 text-red-700',
      green: 'border-green-500 text-green-500',
    },
  },

  defaultVariants: {
    background: 'gray',
  },
})

type StyledContainerProps = {
  children: ReactNode
  width: string
  background: InputBackground
}

export function StyledContainer({ children, background, width }: StyledContainerProps) {
  return (
    <div style={{ width }} className={inputStyles({ background })}>
      {children}
    </div>
  )
}
