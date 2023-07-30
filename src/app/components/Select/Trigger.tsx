'use client'
import { CaretDown } from '@phosphor-icons/react'
import * as S from '@radix-ui/react-select'

interface SelectTriggerProps {
  value: string
}

export function Trigger({ value }: SelectTriggerProps) {
  return (
    <S.Trigger className="flex items-center gap-2 rounded-md overflow-hidden text-green-500 p-2 bg-gray-800 border border-gray-400">
      <S.Value className="text-green-500">{value}</S.Value>
      <S.Icon className="SelectIcon">
        <CaretDown className="text-gray-400" />
      </S.Icon>
    </S.Trigger>
  )
}
