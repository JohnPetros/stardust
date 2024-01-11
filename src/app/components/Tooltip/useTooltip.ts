import { useMemo, useState } from 'react'

export function useTooltip() {
  const [isVisible, setIsVisible] = useState(false)

  function show() {
    setIsVisible(true)
  }

  function hide() {
    setIsVisible(false)
  }

  return useMemo(
    () => ({
      isVisible,
      show,
      hide,
    }),
    [isVisible]
  )
}
