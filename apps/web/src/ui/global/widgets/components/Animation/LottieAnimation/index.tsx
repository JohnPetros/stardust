'use client'

import { useEffect, useImperativeHandle, useRef, useState } from 'react'

import type { AnimationProps } from '../types'
import { LOTTIE_PATHS } from './lotties'
import { useLottieAnimation } from './useLottieAnimation'
import { LottieAnimationView } from './LottieAnimationView'

const lottieDataCache = new Map<string, unknown>()

export const LottieAnimation = ({ ref, name, size, hasLoop = true }: AnimationProps) => {
  const lottieRef = useRef(null)
  const { windowWidth, stopAt, setSpeed, restart } = useLottieAnimation(lottieRef)
  const [lottieData, setLottieData] = useState<unknown>(null)

  useEffect(() => {
    const cachedLottieData = lottieDataCache.get(name)

    if (cachedLottieData) {
      setLottieData(cachedLottieData)
      return
    }

    const abortController = new AbortController()

    async function loadLottieData() {
      try {
        const response = await fetch(LOTTIE_PATHS[name], {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`Failed to load animation data: ${name}`)
        }

        const animationData = await response.json()
        lottieDataCache.set(name, animationData)
        setLottieData(animationData)
      } catch {
        console.log('Failed to load animation data: ', name)
        if (!abortController.signal.aborted) {
          setLottieData(null)
        }
      }
    }

    setLottieData(null)
    void loadLottieData()

    return () => {
      abortController.abort()
    }
  }, [name])

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
