import { type RefObject, useEffect, useState } from 'react'
import { useEventListener } from 'usehooks-ts'

export function useExpandableInput(
  defaultValue: string,
  spanRef: RefObject<HTMLSpanElement | null>,
  inputRef: RefObject<HTMLInputElement | null>,
) {
  const [value, setValue] = useState(defaultValue)

  function handleChange(value: string) {
    setValue(value)
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
  }

  useEffect(() => {
    if ((value || value === '') && spanRef.current && inputRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 8}px`
    }
  }, [value, spanRef, inputRef])

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEventListener('keyup', handleKeyUp, inputRef)

  return {
    value,
    spanRef,
    inputRef,
    handleChange,
  }
}
