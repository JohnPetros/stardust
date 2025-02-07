import { useState, useEffect } from 'react'

export function useConfettiAnimation() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    function handleResize() {
      setWidth(document.body.clientWidth)
      setHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    width,
    height,
  }
}
