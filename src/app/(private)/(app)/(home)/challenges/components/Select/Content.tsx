'use client'
import * as S from '@radix-ui/react-select'
import { ReactNode } from 'react'

interface SelectContentProps {
  children: ReactNode
}

export function Content({ children }: SelectContentProps) {
  return (
    <S.Portal>
      <S.Content
        className="bg-gray-700 rounded-md"
        position="popper"
        sideOffset={8}
      >
        <S.Viewport className="z-40"></S.Viewport>
        {children}
      </S.Content>
    </S.Portal>
  )
}
