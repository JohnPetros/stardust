import Lottie from 'lottie-react'
import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { useLottieAnimation } from './useLottieAnimation'
import { AnimationRef, AnimationProps } from '../types'
import { LOTTIES } from './lotties'

function LottieAnimationComponent(
  { name, size, hasLoop = true }: AnimationProps,
  ref: ForwardedRef<AnimationRef>
) {
  const { lottieRef, restart } = useLottieAnimation()

  const lottieData = LOTTIES[name]

  useImperativeHandle(
    ref,
    () => {
      return {
        restart,
      }
    },
    [restart]
  )

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={lottieData}
      style={{ width: size, height: size }}
      loop={hasLoop}
    />
  )
}

export const LottieAnimation = forwardRef(LottieAnimationComponent)
