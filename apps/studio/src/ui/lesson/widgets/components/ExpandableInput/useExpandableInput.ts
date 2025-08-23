import { type RefObject, useEffect, useState } from 'react'

export function useExpandableInput(
  defaultValue: string,
  spanRef: RefObject<HTMLSpanElement | null>,
  inputRef: RefObject<HTMLInputElement | null>,
) {
  const [value, setValue] = useState(defaultValue)

  function handleChange(value: string) {
    setValue(value)
  }

  useEffect(() => {
    if ((value || value === '') && spanRef.current && inputRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 8}px`
    }
  }, [value, spanRef, inputRef])

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return {
    value,
    spanRef,
    inputRef,
    handleChange,
  }
}
