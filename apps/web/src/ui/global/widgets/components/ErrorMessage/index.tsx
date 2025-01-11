import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export function ErrorMessage({ children, className }: ComponentProps<'p'>) {
  return (
    <p className={twMerge('text-sm font-medium text-red-700', className)}>{children}</p>
  )
}
