'use client'

import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface PageButtonProps {
  children: ReactNode
  isActive: boolean
  isVisible: boolean
  onClick: VoidFunction
}

export function PageButton({ children, isActive, isVisible, onClick }: PageButtonProps) {
  return (
    <button
      type='button'
      className={twMerge(
        'grid h-8 w-8 place-content-center rounded-md text-lg font-medium uppercase transition-opacity duration-200 hover:opacity-70',
        isActive ? 'bg-green-400 text-green-900' : ' text-gray-300',
        isVisible ? 'visible' : 'invisible'
      )}
      onClick={onClick}
      disabled={!isVisible}
    >
      {children}
    </button>
  )
}
