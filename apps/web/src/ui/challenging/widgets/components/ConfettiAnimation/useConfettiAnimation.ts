import { useSleep } from '@/ui/global/hooks/useSleep'
import { useState, useEffect } from 'react'

export function useConfettiAnimation(delay: number) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const { sleep } = useSleep()

  useEffect(() => {
    function handleResize() {
      setWidth(document.body.clientWidth)
      setHeight(window.innerHeight)
    }

    async function showAnimation() {
      await sleep(delay * 1000)
      setIsVisible(true)
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    showAnimation()

    return () => window.removeEventListener('resize', handleResize)
  }, [delay, sleep])

  return {
    width,
    height,
    isVisible,
  }
}
