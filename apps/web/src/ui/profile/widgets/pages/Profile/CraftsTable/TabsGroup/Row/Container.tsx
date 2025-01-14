import Link, { type LinkProps } from 'next/link'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type ContainerProps = {
  index: number
} & LinkProps &
  ComponentProps<'a'>

export function Container({ children, index, className, ...linkProps }: ContainerProps) {
  return (
    <li>
      <Link
        className={twMerge(
          'rounded-md flex item-center justify-between p-6',
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
