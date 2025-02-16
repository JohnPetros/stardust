import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export function Title({ children, className, ...strongProps }: ComponentProps<'strong'>) {
  return (
    <strong
      className={twMerge('text-gray-100 text-sm text-ellipsis font-semibold', className)}
      {...strongProps}
    >
      {children}
    </strong>
  )
}
