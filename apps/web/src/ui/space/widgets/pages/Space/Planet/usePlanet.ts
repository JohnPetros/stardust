import { useState } from 'react'

import type { Planet } from '@stardust/core/space/entities'

import type { SpaceContextValue } from '@/ui/space/contexts/SpaceContext/types'

export type PlanetState = 'locked' | 'liberated' | 'opened'

export type Params = {
  planet: Planet
  space: Pick<SpaceContextValue, 'trail' | 'currentItem' | 'refreshTrail'>
  openingPlanetId: string | null
  openPlanet: (planetId: string) => Promise<void>
  showError: (message: string) => void
}

type ViewParams = Pick<Params, 'planet' | 'space' | 'openingPlanetId'> & {
  state: PlanetState
  isJustOpened: boolean
}

type CurrentItem = Params['space']['currentItem']

function isCurrentPlanet(planet: Planet, currentItem: CurrentItem) {
  return currentItem?.kind === 'planet' && currentItem.planetId.value === planet.id.value
}

function holdsCurrentStar(planet: Planet, currentItem: CurrentItem) {
  if (currentItem?.kind !== 'star') return false

  return planet.stars.some((star) => star.id.value === currentItem.starId.value)
}

function buildFlags({ planet, space, openingPlanetId }: ViewParams) {
  const { currentItem } = space
  const isCurrent = isCurrentPlanet(planet, currentItem)

  return {
    isOpening: openingPlanetId === planet.id.value,
    isCurrent,
    isAnimated: isCurrent || holdsCurrentStar(planet, currentItem),
  }
}

function buildProgress({ planet, space }: ViewParams) {
  return {
    completedStarsCount: space.trail?.countCompletedStars(planet.id).value ?? 0,
    starsCount: planet.stars.length,
  }
}

function buildPlanetView(params: ViewParams) {
  const { planet, state, isJustOpened } = params

  return {
    name: planet.name.value,
    concept: planet.concept?.value ?? null,
    state,
    isOpenable: state === 'liberated',
    isJustOpened,
    ...buildFlags(params),
    ...buildProgress(params),
  }
}

export function usePlanet(params: Params) {
  const { planet, space, openingPlanetId, openPlanet, showError } = params
  const [isJustOpened, setIsJustOpened] = useState(false)
  const state: PlanetState = space.trail?.getPlanetState(planet.id).value ?? 'locked'

  async function handleOpen() {
    if (state !== 'liberated' || openingPlanetId !== null) return

    try {
      await openPlanet(planet.id.value)
      await space.refreshTrail()
      setIsJustOpened(true)
    } catch {
      showError(`Não foi possível abrir ${planet.name.value}. Tente de novo.`)
    }
  }

  return {
    handleOpen,
    view: buildPlanetView({ planet, space, openingPlanetId, state, isJustOpened }),
  }
}
