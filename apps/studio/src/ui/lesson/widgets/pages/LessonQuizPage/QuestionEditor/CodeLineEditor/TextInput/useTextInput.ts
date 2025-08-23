import { useState } from 'react'

export function useTextInput(defaultValue: string) {
  const [value, setValue] = useState(defaultValue)

  function handleChange(value: string) {
    setValue(value)
  }

  return { value, handleChange }
}
