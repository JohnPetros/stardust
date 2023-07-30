import { ReactNode } from 'react'
import * as S from '@radix-ui/react-select'

interface SelectProps {
  children: ReactNode
}

export function Container({ children }: SelectProps) {
  return <S.Root>{children}</S.Root>
}


