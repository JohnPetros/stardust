'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { LOTTIES } from './lotties'
import type { AnimationRef, AnimationProps } from '../types'
import { useLottieAnimation } from './useLottieAnimation'
import Lottie from 'lottie-react'

function LottieAnimationComponent(
  { name, size, hasLoop = true }: AnimationProps,
  ref: ForwardedRef<AnimationRef>,
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
    [restart],
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

export default forwardRef(LottieAnimationComponent)
