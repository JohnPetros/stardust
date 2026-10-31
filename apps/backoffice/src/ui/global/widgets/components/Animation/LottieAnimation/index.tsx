'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react'

import type { LottieRef } from 'lottie-react'
import type { AnimationRef, AnimationProps } from '../types'
import { LOTTIES } from './lotties'
import { useLottieAnimation } from './useLottieAnimation'
import { LottieAnimationView } from './LottieAnimationView'

const Widget = (
  { name, size, hasLoop = true }: AnimationProps,
  ref: ForwardedRef<AnimationRef>,
) => {
  const lottieRef = useRef(null) as LottieRef
  const { windowWidth, stopAt, setSpeed, restart } = useLottieAnimation(lottieRef)
  const lottieData = LOTTIES[name]

  useImperativeHandle(ref, () => {
    return {
      stopAt,
      setSpeed,
      restart,
    }
  }, [stopAt, setSpeed, restart])

  return (
    <LottieAnimationView
      lottieRef={lottieRef}
      data={lottieData}
      size={size}
      windowWidth={windowWidth}
      hasLoop={hasLoop}
    />
  )
}

export const LottieAnimation = forwardRef(Widget)
