import { useMotionValueEvent, useScroll } from 'motion/react'
import type { RefObject } from 'react'

type Options = {
  container?: RefObject<HTMLElement | null>
}

export function useScrollEvent(onScroll: VoidFunction, { container }: Options = {}) {
  const { scrollY } = useScroll(container ? { container } : undefined)

  useMotionValueEvent(scrollY, 'change', onScroll)
}
