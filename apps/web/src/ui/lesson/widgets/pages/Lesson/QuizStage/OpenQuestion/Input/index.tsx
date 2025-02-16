'use client'

import type { ComponentProps } from 'react'

import { StyledContainer } from './StyledContainer'
import { useInput } from './useInput'

export type InputProps = {
  answer: string
} & ComponentProps<'input'>

export function Input({ answer, ...inputProps }: InputProps) {
  const { background, width } = useInput(answer)

  return (
    <StyledContainer background={background} width={width}>
      <input
        className='w-full bg-green-900 px-3 py-2 font-code outline-none'
        maxLength={answer.length}
        {...inputProps}
      />
    </StyledContainer>
  )
}
