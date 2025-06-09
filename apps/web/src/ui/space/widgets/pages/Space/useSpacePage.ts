import { useSpaceContext } from '@/ui/space/contexts/SpaceContext'

export function useSpacePage() {
  const { lastUnlockedStarPosition, scrollIntoLastUnlockedStar } = useSpaceContext()

  function handleFabClick() {
    scrollIntoLastUnlockedStar()
  }

  return {
    lastUnlockedStarPosition,
    handleFabClick,
  }
}
