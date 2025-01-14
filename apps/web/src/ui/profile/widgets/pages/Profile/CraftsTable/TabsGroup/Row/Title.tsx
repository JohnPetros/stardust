import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export function Title({ children, className, ...strongProps }: ComponentProps<'strong'>) {
  return (
    <strong
      className={twMerge('text-gray-900 font-semibold', className)}
      {...strongProps}
    >
      {children}
    </strong>
  )
}
