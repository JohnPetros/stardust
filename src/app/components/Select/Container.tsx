import { ReactNode } from 'react'
import * as S from '@radix-ui/react-select'

interface SelectProps {
  children: ReactNode
  onValueChange: (value: string) => void
}

export function Container({ children, onValueChange }: SelectProps) {
  return (
    <S.Root onValueChange={(value: string) => onValueChange(value)}>
      {children}
    </S.Root>
  )
}
