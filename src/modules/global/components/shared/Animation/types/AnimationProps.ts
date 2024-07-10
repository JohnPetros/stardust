import type { AnimationName } from './AnimationName'

export type AnimationProps = {
  size: number | 'full'
  name: AnimationName
  hasLoop?: boolean
}
