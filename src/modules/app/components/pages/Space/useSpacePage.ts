'use client'

import { useEffect, useState } from 'react'

import { useLocalStorage } from '@/modules/global/hooks/useLocalStorage'
import { useSpaceContext } from '@/modules/app/contexts/SpaceContext'
import { STORAGE } from '@/modules/global/constants'

export function useSpacePage() {
  const shouldSkipTransition = useLocalStorage(
    STORAGE.keys.shouldSkipHomeTransitionAnimation
  )

  const { lastUnlockedStarPosition, scrollIntoLastUnlockedStar } = useSpaceContext()

  const [isTransitionVisible, setIsTransitionVisible] = useState(
    !shouldSkipTransition.has()
  )

  function handleFabClick() {
    scrollIntoLastUnlockedStar()
  }

  useEffect(() => {
    if (!isTransitionVisible) return

    const timeout = setTimeout(() => setIsTransitionVisible(false), 2500)
    shouldSkipTransition.remove()

    return () => clearTimeout(timeout)
  }, [isTransitionVisible, shouldSkipTransition])

  return {
    isTransitionVisible,
    lastUnlockedStarPosition,
    handleFabClick,
  }
}
