'use client'

import * as S from '@radix-ui/react-select'
import { twMerge, type ClassNameValue } from 'tailwind-merge'
import { Icon } from '../Icon'

type SelectTriggerProps = {
  value: string
  className?: ClassNameValue
}

export function Trigger({ value, className }: SelectTriggerProps) {
  return (
    <S.Trigger
      className={twMerge(
        'flex items-center gap-2 overflow-hidden rounded-md border border-gray-400 bg-gray-800 p-3 text-sm text-green-500 transition-[width] duration-200',
        className,
      )}
    >
      <S.Value>{value}</S.Value>
      <S.Icon className='SelectIcon'>
        <Icon name='simple-arrow-down' size={16} className='text-gray-400' />
      </S.Icon>
    </S.Trigger>
  )
}
