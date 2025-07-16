'use client'

import type { ReactNode } from 'react'
import * as S from '@radix-ui/react-select'
import { type ClassNameValue, twMerge } from 'tailwind-merge'

type SelectItemProps = {
  value: string
  children: ReactNode
  className?: ClassNameValue
}

export function Item({ children, className, value }: SelectItemProps) {
  return (
    <S.SelectItem
      value={value}
      className={twMerge(
        'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 outline-gray-400 hover:text-gray-100 focus:text-gray-100',
        className,
      )}
    >
      {children}
    </S.SelectItem>
  )
}
