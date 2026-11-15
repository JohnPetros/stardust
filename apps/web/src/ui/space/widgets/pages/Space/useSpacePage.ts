export type Params = {
  lastUnlockedStarPosition: 'above' | 'in' | 'bellow'
  scrollIntoLastUnlockedStar: () => void
  hasCompletedSpace: boolean
  isFirstGalaxy: boolean
}

export function useSpacePage({
  lastUnlockedStarPosition,
  scrollIntoLastUnlockedStar,
  hasCompletedSpace,
  isFirstGalaxy,
}: Params) {
  const shouldShowEnding = hasCompletedSpace && isFirstGalaxy

  function handleFabClick() {
    scrollIntoLastUnlockedStar()
  }

  return {
    lastUnlockedStarPosition,
    shouldShowEnding,
    handleFabClick,
  }
}
