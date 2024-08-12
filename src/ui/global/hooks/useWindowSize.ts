'use client'

import { useEffect, useState } from 'react'

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleSize()
  }, [])

  return windowSize
}
