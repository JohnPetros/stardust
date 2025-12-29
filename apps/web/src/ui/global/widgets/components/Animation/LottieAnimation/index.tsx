'use client'

import { useImperativeHandle, useRef, useState } from 'react'

import type { AnimationProps } from '../types'
import { LOTTIES } from './lotties'
import { useLottieAnimation } from './useLottieAnimation'
import { LottieAnimationView } from './LottieAnimationView'

export const LottieAnimation = ({ ref, name, size, hasLoop = true }: AnimationProps) => {
  const lottieRef = useRef(null)
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
