import type { ReactNode } from 'react'
import * as S from '@radix-ui/react-select'

type SelectProps<Value> = {
  children: ReactNode
  defaultValue?: string
  onValueChange?: (value: Value) => void
}

export function Container<Value>({
  children,
  defaultValue = '',
  onValueChange,
}: SelectProps<Value>) {
  return (
    <S.Root
      defaultValue={defaultValue}
      onValueChange={(value) => (onValueChange ? onValueChange(value as Value) : null)}
    >
      {children}
    </S.Root>
  )
}
