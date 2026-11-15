'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useSpaceContext } from '@/ui/space/hooks/useSpaceContext'

import { useSpacePage } from './useSpacePage'
import { SpacePageView } from './SpacePageView'

export function SpacePage() {
  const {
    planets,
    galaxy,
    isFirstGalaxy,
    hasGalaxyChoice,
    lastUnlockedStarId,
    lastUnlockedStarPosition,
    scrollIntoLastUnlockedStar,
  } = useSpaceContext()
  const { user } = useAuthContext()
  const { shouldShowEnding, handleFabClick } = useSpacePage({
    lastUnlockedStarPosition,
    scrollIntoLastUnlockedStar,
    hasCompletedSpace: Boolean(user?.hasCompletedSpace.isTrue),
    isFirstGalaxy,
  })

  return (
    <SpacePageView
      planets={planets}
      lastUnlockedStarId={lastUnlockedStarId}
      lastUnlockedStarPosition={lastUnlockedStarPosition}
      galaxyName={galaxy.name}
      hasGalaxyChoice={hasGalaxyChoice}
      shouldShowEnding={shouldShowEnding}
      onFabClick={handleFabClick}
    />
  )
}
