'use client'

import Lottie from 'lottie-react'
import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { useLottieAnimation } from './useLottieAnimation'
import { AnimationRef, AnimationProps } from '../types'
import { LOTTIES } from './lotties'

function LottieAnimationComponent(
  { name, size, hasLoop = true }: AnimationProps,
  ref: ForwardedRef<AnimationRef>
) {
  const { lottieRef, windowWidth, restart } = useLottieAnimation()

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

  if (size === 'full')
    return (
      <Lottie
        lottieRef={lottieRef}
        animationData={lottieData}
        style={{ width: windowWidth }}
        loop={hasLoop}
      />
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
