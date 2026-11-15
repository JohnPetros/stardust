'use client'

import { useCallback, useEffect, useImperativeHandle, useState, type Ref } from 'react'
import type { LottieRef } from 'lottie-react'

import { AppError } from '@stardust/core/global/errors'

import type { AnimationName, AnimationRef } from '../types'
import type { AnimationSpeed } from '../types/AnimationSpeed'
import { LOTTIE_PATHS } from './lotties'

const lottieDataCache = new Map<string, unknown>()

export type Params = {
  ref?: Ref<AnimationRef>
  lottieRef: LottieRef
  name: AnimationName
  src?: string
  hasLoop: boolean
  isStatic: boolean
}

function useLottieData(lottieUrl: string) {
  const [lottieData, setLottieData] = useState<unknown>(
    () => lottieDataCache.get(lottieUrl) ?? null,
  )

  useEffect(() => {
    const cachedLottieData = lottieDataCache.get(lottieUrl)

    if (cachedLottieData) {
      setLottieData(cachedLottieData)
      return
    }

    const abortController = new AbortController()

    async function loadLottieData() {
      try {
        const response = await fetch(lottieUrl, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new AppError(`Failed to load animation data: ${lottieUrl}`)
        }

        const animationData = await response.json()
        lottieDataCache.set(lottieUrl, animationData)
        setLottieData(animationData)
      } catch {
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
  }, [lottieUrl])

  return lottieData
}

function useLottieControls(lottieRef: LottieRef) {
  const restart = useCallback(() => {
    lottieRef.current?.goToAndPlay(0)
  }, [lottieRef.current?.goToAndPlay])

  const stopAt = useCallback(
    (second: number) => {
      lottieRef.current?.goToAndStop(second * 100, true)
    },
    [lottieRef.current?.goToAndStop],
  )

  const setSpeed = useCallback(
    (speed: AnimationSpeed) => {
      const speeds: Record<AnimationSpeed, number> = {
        '0.5x': 0.5,
        '1x': 1,
        '1.5x': 1.5,
        '2x': 2,
      }

      lottieRef.current?.setSpeed(speeds[speed])
    },
    [lottieRef.current?.setSpeed],
  )

  return { restart, stopAt, setSpeed }
}

export function useLottieAnimation({
  ref,
  lottieRef,
  name,
  src,
  hasLoop,
  isStatic,
}: Params) {
  const [windowWidth, setWindowWidth] = useState(0)
  const lottieData = useLottieData(src ?? LOTTIE_PATHS[name])
  const { restart, stopAt, setSpeed } = useLottieControls(lottieRef)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
    }
  }, [])

  useEffect(() => {
    if (isStatic && lottieData) {
      lottieRef.current?.goToAndStop(0, true)
    }
  }, [isStatic, lottieData, lottieRef])

  useImperativeHandle(ref, () => {
    return {
      stopAt,
      setSpeed,
      restart,
    }
  }, [stopAt, setSpeed, restart])

  return {
    lottieData,
    windowWidth,
    shouldAutoplay: !isStatic,
    shouldLoop: isStatic ? false : hasLoop,
    stopAt,
    setSpeed,
    restart,
  }
}
