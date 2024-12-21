'use client'

import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useSpaceContext } from '@/ui/space/contexts/SpaceContext'
import { STORAGE } from '@/ui/global/constants'

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
