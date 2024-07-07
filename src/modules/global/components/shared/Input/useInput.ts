import { useState } from 'react'

export function useInput(type: string) {
  const [innerType, setInnerType] = useState(type)

  function handleEyeClick() {
    if (innerType === 'password') {
      setInnerType('text')
      return
    }
    setInnerType('password')
  }

  return {
    handleEyeClick,
    innerType,
  }
}
