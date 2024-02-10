'use client'
import { ReactNode } from 'react'
import * as S from '@radix-ui/react-select'

interface SelectContentProps {
  children: ReactNode
}

export function Content({ children }: SelectContentProps) {
  return (
    <S.Portal>
      <S.Content
        className="rounded-md bg-gray-700"
        position="popper"
        sideOffset={8}
      >
        <S.Viewport className="z-40"></S.Viewport>
        {children}
      </S.Content>
    </S.Portal>
  )
}
