import type { ComponentProps, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

type NavButtonProps = {
  isActive: boolean
} & ComponentProps<'button'>

export function NavButton({
  children,
  isActive,
  ...buttonProps
}: PropsWithChildren<NavButtonProps>) {
  return (
    <button
      className={twMerge(
        'w-full bg-transparent py-3 text-center font-medium',
        isActive ? 'text-green-400' : 'text-gray-100',
      )}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
