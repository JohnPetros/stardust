type Params = {
  lastUnlockedStarPosition: 'above' | 'in' | 'bellow'
  scrollIntoLastUnlockedStar: () => void
}

export function useSpacePage({
  lastUnlockedStarPosition,
  scrollIntoLastUnlockedStar,
}: Params) {
  function handleFabClick() {
    scrollIntoLastUnlockedStar()
  }

  return {
    lastUnlockedStarPosition,
    handleFabClick,
  }
}
