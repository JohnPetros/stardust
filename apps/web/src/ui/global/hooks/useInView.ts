import { useInView as useFramerMotionInView } from 'framer-motion'
import type { RefObject } from 'react'

export function useInView(ref: RefObject<Element>) {
  return useFramerMotionInView(ref)
}
