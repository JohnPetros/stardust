import type { ReactNode } from 'react'
import * as S from '@radix-ui/react-select'

type SelectProps<Value> = {
  children: ReactNode
  value?: Value
  defaultValue?: Value
  onValueChange?: (value: Value) => void
}

export function Container<Value>({
  children,
  value,
  defaultValue,
  onValueChange,
}: SelectProps<Value>) {
  return (
    <S.Root
      defaultValue={String(defaultValue)}
      value={String(value)}
      onValueChange={(value) => (onValueChange ? onValueChange(value as Value) : null)}
    >
      {children}
    </S.Root>
  )
}
