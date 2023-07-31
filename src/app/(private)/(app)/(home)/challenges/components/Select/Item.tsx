'use client'
import { ReactNode } from 'react'
import * as S from '@radix-ui/react-select'
import { twMerge } from 'tailwind-merge'
import { Icon } from '@phosphor-icons/react'

interface SelectItemProps {
  text: ReactNode
  textStye?: string
  value: string
  icon?: Icon
  iconStyles?: string
}

export function Item({
  text,
  textStye,
  icon: Icon,
  iconStyles,
  value,
}: SelectItemProps) {
  return (
    <S.SelectItem
      value={value}
      className={twMerge(
        'flex items-center gap-2 px-4 py-2 cursor-pointer text-gray-400 font-medium outline-gray-400 focus:text-gray-100 hover:text-gray-100 text-sm',
        textStye
      )}
    >
      {Icon && <Icon className={iconStyles} />}
      <S.SelectItemText>{text}</S.SelectItemText>
    </S.SelectItem>
  )
}
