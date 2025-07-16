import * as S from '@radix-ui/react-select'
import type { PropsWithChildren } from 'react'

import { ErrorMessage } from '../ErrorMessage'

type Props<Value> = {
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
}: PropsWithChildren<Props<Value>>) {
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
