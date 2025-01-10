import { useState } from 'react'

export function useChallengeField() {
  const [isContentExpanded, setIsContentExpanded] = useState(false)

  function handleArrowClick() {
    setIsContentExpanded((isContentExpanded) => !isContentExpanded)
  }

  return {
    isContentExpanded,
    handleArrowClick,
  }
}
