'use client'
import { Icon } from '@phosphor-icons/react'
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
      className="flex items-center gap-2 p-3 cursor-pointer text-gray-400 font-medium outline-slate-700 "
    >
      {icon}
      <S.SelectItemText>{text}</S.SelectItemText>
    </S.SelectItem>
  )
}
