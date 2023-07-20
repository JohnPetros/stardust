'use client'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className: string
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      className={twMerge(
        'py-2 px-4 rounded bg-green-400 w-full text-lg font-semibold hover:opacity-2',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
