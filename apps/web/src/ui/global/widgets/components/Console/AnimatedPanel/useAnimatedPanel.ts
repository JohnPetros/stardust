import { type PanInfo, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

export function useAnimatedPanel(isOpen: boolean, onDragDown: VoidFunction) {
  const controls = useAnimation()

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.velocity.y > 20 && info.offset.y >= 50) {
      onDragDown()
    }
  }

  useEffect(() => {
    if (isOpen) {
      controls.start('open')
      return
    }
    controls.start('closed')
  }, [isOpen, controls])

  return {
    controls,
    handleDragEnd,
  }
}
