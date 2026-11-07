import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const ErrorMessageView = ({ children, className }: ComponentProps<'p'>) => {
  return (
    <p className={twMerge('text-sm font-medium text-theme-danger', className)}>
      {children}
    </p>
  )
}
