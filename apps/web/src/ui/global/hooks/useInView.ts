import { useInView as useFramerMotionInView } from 'framer-motion'
import type { RefObject } from 'react'

type Options = {
  shouldExecuteOnde?: boolean
}

export function useInView(
  ref: RefObject<Element>,
  { shouldExecuteOnde = false }: Options = {},
) {
  return useFramerMotionInView(ref, { once: shouldExecuteOnde })
}
