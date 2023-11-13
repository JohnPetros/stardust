import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface NavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string
  isActive: boolean
}

export function NavButton({ children, isActive, ...rest }: NavButtonProps) {
  return (
    <button
      className={twMerge(
        'w-full bg-transparent py-3 text-center font-medium',
        isActive ? 'text-green-400' : 'text-gray-100'
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
