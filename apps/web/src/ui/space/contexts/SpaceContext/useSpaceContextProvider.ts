import { type RefObject, useCallback, useMemo, useRef, useState } from 'react'

import type { User } from '@stardust/core/profile/entities'
import type { Planet } from '@stardust/core/space/entities'
import type { CurrentGalaxyDto } from '@stardust/core/space/entities/dtos'
import { GalaxyTrail, type GalaxyTrailCurrentItem } from '@stardust/core/space/structures'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useCurrentItemScroll } from './useCurrentItemScroll'

function getCurrentItemId(currentItem: GalaxyTrailCurrentItem) {
  if (!currentItem) return null

  return currentItem.kind === 'star'
    ? currentItem.starId.value
    : currentItem.planetId.value
}

function useTrail(planets: Planet[], user: User | null) {
  return useMemo(() => {
    if (!user) return { trail: null, currentItem: null, currentItemId: null }

    const trail = GalaxyTrail.create({
      planets,
      completedStarsIds: user.completedStarsIds,
      openedPlanetsIds: user.openedPlanetsIds,
    })
    const currentItem = trail.currentItem

    return { trail, currentItem, currentItemId: getCurrentItemId(currentItem) }
  }, [planets, user])
}

function useStarAnimations() {
  const animationsRef = useRef(new Map<string, RefObject<AnimationRef | null>>())

  const registerStarAnimation = useCallback(
    (starId: string, animationRef: RefObject<AnimationRef | null>) => {
      animationsRef.current.set(starId, animationRef)

      return () => {
        if (animationsRef.current.get(starId) === animationRef) {
          animationsRef.current.delete(starId)
        }
      }
    },
    [],
  )

  const restartStarAnimation = useCallback((starId: string) => {
    animationsRef.current.get(starId)?.current?.restart()
  }, [])

  return useMemo(
    () => ({ registerStarAnimation, restartStarAnimation }),
    [registerStarAnimation, restartStarAnimation],
  )
}

function useStarSelection(currentItem: GalaxyTrailCurrentItem) {
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null)
  const [isStarDetailsOpen, setIsStarDetailsOpen] = useState(false)
  const currentStarId = currentItem?.kind === 'star' ? currentItem.starId.value : null

  const selectStar = useCallback((starId: string) => setSelectedStarId(starId), [])
  const openStarDetails = useCallback(() => setIsStarDetailsOpen(true), [])
  const closeStarDetails = useCallback(() => setIsStarDetailsOpen(false), [])

  return useMemo(
    () => ({
      selectedStarId: selectedStarId ?? currentStarId,
      isStarDetailsOpen,
      selectStar,
      openStarDetails,
      closeStarDetails,
    }),
    [
      selectedStarId,
      currentStarId,
      isStarDetailsOpen,
      selectStar,
      openStarDetails,
      closeStarDetails,
    ],
  )
}

export function useSpaceContextProvider(
  planets: Planet[],
  user: User | null,
  currentGalaxy: CurrentGalaxyDto,
  refetchUser: () => Promise<unknown>,
) {
  const { trail, currentItem, currentItemId } = useTrail(planets, user)
  const scroll = useCurrentItemScroll(currentItemId)
  const selection = useStarSelection(currentItem)
  const animations = useStarAnimations()

  const refreshTrail = useCallback(async () => {
    await refetchUser()
  }, [refetchUser])

  return useMemo(
    () => ({
      planets,
      galaxy: currentGalaxy.galaxy,
      isFirstGalaxy: currentGalaxy.isFirstGalaxy,
      hasGalaxyChoice: currentGalaxy.hasGalaxyChoice,
      trail,
      currentItem,
      ...selection,
      ...animations,
      ...scroll,
      refreshTrail,
    }),
    [
      planets,
      currentGalaxy,
      trail,
      currentItem,
      selection,
      animations,
      scroll,
      refreshTrail,
    ],
  )
}
