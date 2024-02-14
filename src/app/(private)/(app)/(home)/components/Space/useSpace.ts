'use client'

import { useEffect, useState } from 'react'

import { useSpaceContext } from '@/contexts/SpaceContext/hooks/useSpaceContext'
import { STORAGE } from '@/global/constants'
import { useLocalStorage } from '@/global/hooks/useLocalStorage'

export function useSpace() {
  const shouldSkipTransition = useLocalStorage(
    STORAGE.keys.shouldSkipHomeTransitionAnimation
  )

  const { lastUnlockedStarPosition, scrollIntoLastUnlockedStar } =
    useSpaceContext()

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
