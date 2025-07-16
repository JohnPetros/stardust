'use client'

import type { PropsWithChildren } from 'react'
import * as S from '@radix-ui/react-select'

export function Content({ children }: PropsWithChildren) {
  return (
    <S.Portal>
      <S.Content className='rounded-md bg-gray-700' position='popper' sideOffset={8}>
        <S.Viewport className='z-40' />
        {children}
      </S.Content>
    </S.Portal>
  )
}
