'use client'
import { CaretDown } from '@phosphor-icons/react'
import * as S from '@radix-ui/react-select'

interface SelectTriggerProps {
  value: string
}

export function Trigger({ value }: SelectTriggerProps) {
  return (
    <S.Trigger className="flex items-center gap-2 overflow-hidden rounded-md border border-gray-400 bg-gray-800 p-2 text-sm text-green-500 transition-[width] duration-200">
      <S.Value>{value}</S.Value>
      <S.Icon className="SelectIcon">
        <CaretDown className="text-gray-400" />
      </S.Icon>
    </S.Trigger>
  )
}
