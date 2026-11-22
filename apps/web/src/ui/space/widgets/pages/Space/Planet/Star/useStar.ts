import { useEffect, useRef } from 'react'

import type { Id } from '@stardust/core/global/structures'

import type { SpaceContextValue } from '@/ui/space/contexts/SpaceContext/types'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

export type StarState = 'locked' | 'available' | 'completed'
export type StarPlanetState = 'locked' | 'liberated' | 'opened'

type Space = Pick<
  SpaceContextValue,
  | 'trail'
  | 'currentItem'
  | 'selectedStarId'
  | 'selectStar'
  | 'openStarDetails'
  | 'registerStarAnimation'
>

export type Params = {
  starId: Id
  planetId: Id
  isChallenge: boolean
  previousStarNumber: number | null
  space: Space
}

const STATE_LABEL: Record<StarState, string | null> = {
  locked: null,
  available: 'Disponível',
  completed: 'Concluída',
}

function getUnlockHint(
  state: StarState,
  planetState: StarPlanetState,
  previousStarNumber: number | null,
) {
  if (state !== 'locked') return null
  if (planetState !== 'opened') return 'Abra o planeta para liberar'
  if (previousStarNumber === null) return 'Conclua a estrela anterior para liberar'

  return `Conclua a estrela ${previousStarNumber} para liberar`
}

type ViewParams = Params & { state: StarState; planetState: StarPlanetState }

function buildStarView({
  starId,
  isChallenge,
  previousStarNumber,
  space,
  state,
  planetState,
}: ViewParams) {
  const { currentItem, selectedStarId } = space

  return {
    id: starId.value,
    state,
    isAccessible: state !== 'locked',
    isChallenge,
    isCurrent: currentItem?.kind === 'star' && currentItem.starId.value === starId.value,
    isSelected: selectedStarId === starId.value,
    typeLabel: isChallenge ? 'Desafio de código' : 'História',
    stateLabel: STATE_LABEL[state],
    unlockHint: getUnlockHint(state, planetState, previousStarNumber),
  }
}

export function useStar(params: Params) {
  const { starId, planetId, space } = params
  const { trail, selectStar, openStarDetails, registerStarAnimation } = space
  const starAnimationRef = useRef<AnimationRef>(null)
  const state: StarState = trail?.getStarState(starId).value ?? 'locked'
  const planetState: StarPlanetState = trail?.getPlanetState(planetId).value ?? 'locked'

  useEffect(() => {
    return registerStarAnimation(starId.value, starAnimationRef)
  }, [starId.value, registerStarAnimation])

  function handleSelect() {
    if (state !== 'locked') selectStar(starId.value)
  }

  function handleClick() {
    if (state === 'locked') return

    selectStar(starId.value)
    openStarDetails()
  }

  return {
    hasTrail: trail !== null,
    handleSelect,
    handleClick,
    view: { ...buildStarView({ ...params, state, planetState }), starAnimationRef },
  }
}
