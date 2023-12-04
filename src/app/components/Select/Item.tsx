'use client'
import { ReactNode } from 'react'
import { Icon } from '@phosphor-icons/react'
import * as S from '@radix-ui/react-select'
import { twMerge } from 'tailwind-merge'

interface SelectItemProps {
  text: ReactNode
  textStyes?: string
  value: string
  icon?: Icon
  iconStyles?: string
}

export function Item({
  text,
  textStyes,
  icon: Icon,
  iconStyles,
  value,
}: SelectItemProps) {
  return (
    <S.SelectItem
      value={value}
      className={twMerge(
        'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 outline-gray-400 hover:text-gray-100 focus:text-gray-100',
        textStyes
      )}
    >
      {Icon && <Icon className={iconStyles} />}
      <S.SelectItemText>{text}</S.SelectItemText>
    </S.SelectItem>
  )
}
