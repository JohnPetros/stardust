import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export function NoRowsMessage({ children, className, ...pProps }: ComponentProps<'p'>) {
  return (
    <p className={twMerge('px-6 py-20 text-gray-500 font-medium', className)} {...pProps}>
      {children}
    </p>
  )
}
