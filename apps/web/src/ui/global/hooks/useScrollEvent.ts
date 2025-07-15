import { useMotionValueEvent, useScroll } from 'motion/react'

export function useScrollEvent(onScroll: VoidFunction) {
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', onScroll)
}
