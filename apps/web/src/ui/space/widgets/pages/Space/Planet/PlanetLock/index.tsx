'use client'

import { useReducedMotion } from 'motion/react'

import { PlanetLockView } from './PlanetLockView'
import { usePlanetLock, type Params } from './usePlanetLock'

type Props = Omit<Params, 'isReducedMotion'>

export function PlanetLock({ planetState, isJustOpened }: Props) {
  const isReducedMotion = Boolean(useReducedMotion())
  const { phase, hasLoadFailed, handleLoadError } = usePlanetLock({
    planetState,
    isJustOpened,
    isReducedMotion,
  })

  return (
    <PlanetLockView
      phase={phase}
      hasLoadFailed={hasLoadFailed}
      onLoadError={handleLoadError}
    />
  )
}
