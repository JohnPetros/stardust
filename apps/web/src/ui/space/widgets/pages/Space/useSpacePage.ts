import type { SpaceContextValue } from '@/ui/space/contexts/SpaceContext/types'

export type Params = {
  space: Pick<
    SpaceContextValue,
    | 'planets'
    | 'galaxy'
    | 'hasGalaxyChoice'
    | 'trail'
    | 'currentItem'
    | 'currentItemPosition'
    | 'scrollToCurrentItem'
    | 'isStarDetailsOpen'
    | 'selectedStarId'
    | 'closeStarDetails'
  >
  isFirstGalaxy: boolean
  hasCompletedSpace: boolean
  isMobile: boolean
}

export type SpacePageStatus = 'loading' | 'empty' | 'ready'

function getStatus(hasTrail: boolean, planetsCount: number): SpacePageStatus {
  if (!hasTrail) return 'loading'
  if (planetsCount === 0) return 'empty'

  return 'ready'
}

function getIsFabVisible(
  status: SpacePageStatus,
  space: Params['space'],
  isSheetOpen: boolean,
) {
  return (
    status === 'ready' &&
    space.currentItem !== null &&
    space.currentItemPosition !== 'in' &&
    !isSheetOpen
  )
}

export function useSpacePage({
  space,
  isFirstGalaxy,
  hasCompletedSpace,
  isMobile,
}: Params) {
  const { planets, currentItemPosition, selectedStarId } = space
  const status = getStatus(space.trail !== null, planets.length)
  const isSheetOpen = isMobile && space.isStarDetailsOpen

  function handleFabClick() {
    space.scrollToCurrentItem()
  }

  function handleSheetClose() {
    space.closeStarDetails()

    if (!selectedStarId) return

    window.setTimeout(() => {
      document.getElementById(`star-${selectedStarId}`)?.focus()
    }, 0)
  }

  return {
    handleFabClick,
    handleSheetClose,
    view: {
      status,
      planets,
      galaxyName: space.galaxy.name,
      hasGalaxyChoice: space.hasGalaxyChoice,
      shouldShowEnding: hasCompletedSpace && isFirstGalaxy,
      isMobile,
      isSheetOpen,
      isFabVisible: getIsFabVisible(status, space, isSheetOpen),
      currentItemPosition,
    },
  }
}
