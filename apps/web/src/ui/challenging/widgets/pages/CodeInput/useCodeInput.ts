import { useState } from 'react'

export function useCodeInput() {
  const [isContentExpanded, setIsContentExpanded] = useState(true)

  function handleArrowClick() {
    setIsContentExpanded((isContentExpanded) => !isContentExpanded)
  }

  return {
    isContentExpanded,
    handleArrowClick,
  }
}
