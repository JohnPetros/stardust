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
  onLoadError?: () => void
}

async function loadLottieData(
  lottieUrl: string,
  signal: AbortSignal,
  setLottieData: (lottieData: unknown) => void,
  onLoadError?: () => void,
) {
  try {
    const response = await fetch(lottieUrl, { signal })

    if (!response.ok) {
      throw new AppError(`Failed to load animation data: ${lottieUrl}`)
    }

    const animationData = await response.json()
    lottieDataCache.set(lottieUrl, animationData)
    setLottieData(animationData)
  } catch {
    if (!signal.aborted) {
      setLottieData(null)
      onLoadError?.()
    }
  }
}

function useLottieData(lottieUrl: string, onLoadError?: () => void) {
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

    setLottieData(null)
    void loadLottieData(lottieUrl, abortController.signal, setLottieData, onLoadError)

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
  onLoadError,
}: Params) {
  const [windowWidth, setWindowWidth] = useState(0)
  const lottieData = useLottieData(src ?? LOTTIE_PATHS[name], onLoadError)
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
