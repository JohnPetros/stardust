import type { AnimationName } from './AnimationName'
import type { AnimationRef } from './AnimationRef'

export type AnimationProps = {
  ref?: React.Ref<AnimationRef>
  size: number | 'full'
  name: AnimationName
  hasLoop?: boolean
}
