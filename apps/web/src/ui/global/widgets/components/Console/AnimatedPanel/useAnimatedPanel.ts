import { type PanInfo, useAnimation } from 'motion/react'
import { useEffect } from 'react'

export function useAnimatedPanel(isOpen: boolean, onDragDown: VoidFunction) {
  const animation = useAnimation()

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.velocity.y > 20 && info.offset.y >= 50) {
      onDragDown()
    }
  }

  useEffect(() => {
    if (isOpen) {
      animation.start('open')
      return
    }
    animation.start('closed')
  }, [isOpen, animation])

  return {
    animation,
    handleDragEnd,
  }
}
