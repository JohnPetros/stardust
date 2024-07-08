import { ReactNode } from 'react'
import * as S from '@radix-ui/react-select'

type SelectProps = {
  children: ReactNode
  defaultValue: string
  onValueChange?: (value: string) => void
}

export function Container({
  children,
  defaultValue,
  onValueChange,
}: SelectProps) {
  return (
    <S.Root defaultValue={defaultValue} onValueChange={onValueChange}>
      {children}
    </S.Root>
  )
}
