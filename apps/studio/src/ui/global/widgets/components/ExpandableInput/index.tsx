import { useRef } from 'react'

import { ExpandableInputView } from './ExpandableInputView'
import { useExpandableInput } from './useExpandableInput'

type Props = {
  defaultValue: string
  className?: string
  onBlur?: (value: string) => void
}

export const ExpandableInput = ({ defaultValue, className, onBlur }: Props) => {
  const spanRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { value, handleChange } = useExpandableInput(defaultValue, spanRef, inputRef)

  return (
    <ExpandableInputView
      inputValue={value}
      spanRef={spanRef}
      inputRef={inputRef}
      onValueChange={handleChange}
      onBlur={onBlur}
      className={className}
    />
  )
}
