import Link, { type LinkProps } from 'next/link'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type RowProps = {
  index: number
} & LinkProps &
  ComponentProps<'a'>

export function Row({ children, index, className, ...linkProps }: RowProps) {
  return (
    <li>
      <Link
        className={twMerge(
          'flex item-center justify-between p-6',
          className,
          (index + 1) % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700',
        )}
        {...linkProps}
      >
        {children}
      </Link>
    </li>
  )
}
