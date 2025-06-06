import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const NoRowsMessageView = ({
  children,
  className,
  ...pProps
}: ComponentProps<'p'>) => {
  return (
    <p
      className={twMerge('px-6 py-20 text-gray-500 text-center font-medium', className)}
      {...pProps}
    >
      {children}
    </p>
  )
}
