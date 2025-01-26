'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import type { AnimationRef, AnimationProps } from '../types'
import { LOTTIES } from './lotties'
import { useLottieAnimation } from './useLottieAnimation'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
})

function LottieAnimationComponent(
  { name, size, hasLoop = true }: AnimationProps,
  ref: ForwardedRef<AnimationRef>,
) {
  const { lottieRef, windowWidth, windowHeight, restart } = useLottieAnimation()
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
        style={{
          width: windowWidth,
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
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
