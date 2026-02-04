import type { ComponentProps, PropsWithChildren } from 'react'

export type NavButtonProps = PropsWithChildren<
  {
    isActive: boolean
  } & ComponentProps<'button'>
>

export const NavButtonView = ({ children, isActive, ...buttonProps }: NavButtonProps) => (
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

import { twMerge } from 'tailwind-merge'
