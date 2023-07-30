'use client'
import { ReactNode } from 'react'
import * as S from '@radix-ui/react-select'
import { twMerge } from 'tailwind-merge'

interface SelectItemProps {
  text: ReactNode
  textStye?: string
  value: string
  icon?: ReactNode
}

export function Item({ text, textStye, icon, value }: SelectItemProps) {
  return (
    <S.SelectItem
      value={value}
      className={twMerge(
        'flex items-center gap-2 px-6 py-3 cursor-pointer text-gray-400 font-medium outline-gray-400 focus:text-gray-100 hover:text-gray-100',
        textStye
      )}
    >
      {icon}
      <S.SelectItemText>{text}</S.SelectItemText>
    </S.SelectItem>
  )
}
