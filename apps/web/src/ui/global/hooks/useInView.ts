import { useInView as useFramerMotionInView } from 'framer-motion'
import type { RefObject } from 'react'

type Options = {
  shouldExecuteOnce?: boolean
}

export function useInView(
  ref: RefObject<Element>,
  { shouldExecuteOnce = false }: Options = {},
) {
  return useFramerMotionInView(ref, { once: shouldExecuteOnce })
}
