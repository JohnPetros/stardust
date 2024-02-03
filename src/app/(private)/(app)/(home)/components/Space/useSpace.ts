'use client'

import { useEffect, useState } from 'react'

import { useSpaceContext } from '@/contexts/SpaceContext/hooks/useSpaceContext'
import { STORAGE } from '@/utils/constants'

export function useSpace() {
  const hasTransitionAnimation = Boolean(
    localStorage.getItem(STORAGE.hasPageAnimationTransition)
  )

  const { lastUnlockedStarPosition, scrollIntoLastUnlockedStar } =
    useSpaceContext()

  const [isTransitionVisible, setIsTransitionVisible] = useState(
    hasTransitionAnimation
  )

  function handleFabClick() {
    scrollIntoLastUnlockedStar()
  }

  useEffect(() => {
    if (!isTransitionVisible) return

    const timeout = setTimeout(() => setIsTransitionVisible(false), 2500)
    localStorage.removeItem(STORAGE.hasPageAnimationTransition)

    return () => clearTimeout(timeout)
  }, [isTransitionVisible])

  return {
    isTransitionVisible,
    lastUnlockedStarPosition,
    handleFabClick,
  }
}
