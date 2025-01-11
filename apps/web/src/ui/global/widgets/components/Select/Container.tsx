import type { ReactNode } from 'react'
import * as S from '@radix-ui/react-select'

import { ErrorMessage } from '../ErrorMessage'

type SelectProps<Value> = {
  children: ReactNode
  value?: Value
  defaultValue?: Value
  errorMessage?: string
  onValueChange?: (value: Value) => void
}

export function Container<Value>({
  children,
  value,
  defaultValue,
  errorMessage,
  onValueChange,
}: SelectProps<Value>) {
  return (
    <S.Root
      defaultValue={String(defaultValue)}
      value={String(value)}
      onValueChange={(value) => (onValueChange ? onValueChange(value as Value) : null)}
    >
      {children}
      {errorMessage && <ErrorMessage className='mt-1'>{errorMessage}</ErrorMessage>}
    </S.Root>
  )
}
