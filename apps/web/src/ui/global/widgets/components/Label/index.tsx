import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type LabelProps = {
  title: string
  isFailure?: boolean
} & ComponentProps<'label'>

export function Label({
  isFailure,
  title,
  children,
  className,
  ...labelProps
}: LabelProps) {
  return (
    <label {...labelProps}>
      <span
        className={twMerge(
          'text-sm font-medium',
          isFailure ? 'text-red-700' : 'text-gray-100 focus-within:text-green-400',
          className,
        )}
      >
        {title}
      </span>
      {children}
    </label>
  )
}
