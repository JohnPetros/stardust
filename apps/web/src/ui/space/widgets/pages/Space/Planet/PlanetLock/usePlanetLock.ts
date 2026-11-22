import { useEffect, useState } from 'react'

export type PlanetLockPhase = 'static' | 'loop' | 'opening' | 'fade' | 'hidden'

export type Params = {
  planetState: 'locked' | 'liberated' | 'opened'
  isJustOpened: boolean
  isReducedMotion: boolean
}

export const OPENING_DURATION_IN_MS = 2000
export const FADE_DURATION_IN_MS = 400

function getPhase({
  planetState,
  isJustOpened,
  isReducedMotion,
  hasLoadFailed,
  isOpeningDone,
}: Params & { hasLoadFailed: boolean; isOpeningDone: boolean }): PlanetLockPhase {
  if (planetState === 'opened') {
    if (!isJustOpened || isOpeningDone) return 'hidden'

    return isReducedMotion || hasLoadFailed ? 'fade' : 'opening'
  }

  if (planetState === 'liberated' && !isReducedMotion) return 'loop'

  return 'static'
}

export function usePlanetLock({ planetState, isJustOpened, isReducedMotion }: Params) {
  const [hasLoadFailed, setHasLoadFailed] = useState(false)
  const [isOpeningDone, setIsOpeningDone] = useState(false)
  const phase = getPhase({
    planetState,
    isJustOpened,
    isReducedMotion,
    hasLoadFailed,
    isOpeningDone,
  })

  useEffect(() => {
    if (phase !== 'opening' && phase !== 'fade') return

    const duration = phase === 'opening' ? OPENING_DURATION_IN_MS : FADE_DURATION_IN_MS
    const timeout = window.setTimeout(() => setIsOpeningDone(true), duration)

    return () => window.clearTimeout(timeout)
  }, [phase])

  function handleLoadError() {
    setHasLoadFailed(true)
  }

  return { phase, hasLoadFailed, handleLoadError }
}
