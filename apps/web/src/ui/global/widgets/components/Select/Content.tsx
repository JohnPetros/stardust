'use client'

import type { PropsWithChildren } from 'react'
import * as S from '@radix-ui/react-select'

export function Content({ children }: PropsWithChildren) {
  return (
    <S.Portal>
      <S.Content
        className='z-[700] overflow-hidden rounded-md border border-gray-500 bg-gray-700'
        position='popper'
        sideOffset={8}
      >
        <S.Viewport>{children}</S.Viewport>
      </S.Content>
    </S.Portal>
  )
}
