import { useMotionValueEvent, useScroll } from 'framer-motion'

export function useScrollEvent(onScroll: VoidFunction) {
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', onScroll)
}
