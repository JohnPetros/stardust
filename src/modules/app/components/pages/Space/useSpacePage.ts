'use client'

import { useLocalStorage } from '@/modules/global/hooks/useLocalStorage'
import { useSpaceContext } from '@/modules/app/contexts/SpaceContext'
import { STORAGE } from '@/modules/global/constants'

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
