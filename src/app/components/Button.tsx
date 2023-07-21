'use client'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import { Animation } from './Animation'
import Loading from '../../../public/animations/loading.json'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  isLoading?: boolean
}

export function Button({
  children,
  className,
  isLoading = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        'py-2 px-4 rounded bg-green-400 w-full font-semibold hover:brightness-110 transition-all duration-200',
        className
      )}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? <Animation src={Loading} size={24} /> : children}
    </button>
  )
}
