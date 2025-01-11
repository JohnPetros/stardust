'use client'

import * as S from '@radix-ui/react-select'
import { twMerge, type ClassNameValue } from 'tailwind-merge'
import { Icon } from '../Icon'

type SelectTriggerProps = {
  value: string
  className?: ClassNameValue
  isDiabled?: boolean
}

export function Trigger({ value, className, isDiabled = false }: SelectTriggerProps) {
  return (
    <S.Trigger
      disabled={isDiabled}
      className={twMerge(
        'flex items-center gap-2 overflow-hidden rounded-md border border-gray-400 bg-gray-800 p-3 text-sm text-green-500 duration-200',
        className,
        isDiabled && 'opacity-75 pointer-events-none',
      )}
    >
      <S.Value>{value}</S.Value>
      <S.Icon className='SelectIcon'>
        <Icon name='simple-arrow-down' size={16} className='text-gray-400' />
      </S.Icon>
    </S.Trigger>
  )
}
