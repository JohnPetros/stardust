import { useInView as useFramerMotionInView } from 'motion/react'
import type { RefObject } from 'react'

type Options = {
  shouldExecuteOnce?: boolean
}

export function useInView(
  ref: RefObject<Element | null>,
  { shouldExecuteOnce = false }: Options = {},
) {
  return useFramerMotionInView(ref, { once: shouldExecuteOnce })
}
