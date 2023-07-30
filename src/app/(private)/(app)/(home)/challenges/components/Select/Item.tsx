'use client'
import { ReactNode } from 'react'
import * as S from '@radix-ui/react-select'

interface SelectItemProps {
  text: ReactNode
  value: string
  icon?: ReactNode
}

export function Item({ text, icon, value }: SelectItemProps) {
  return (
    <S.SelectItem
      value={value}
      className="flex items-center gap-2 p-3 cursor-pointer text-gray-400 font-medium outline-gray-400 focus:text-gray-100 hover:text-gray-100"
    >
      {icon}
      <S.SelectItemText>{text}</S.SelectItemText>
    </S.SelectItem>
  )
}
