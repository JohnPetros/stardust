import { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface NavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  isActive: boolean
}

export function NavButton({ children, isActive, ...rest }: NavButtonProps) {
  return (
    <button
      className={twMerge(
        'bg-transparent text-center w-full py-3 font-medium',
        isActive ? 'text-green-400' : 'text-gray-100'
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
