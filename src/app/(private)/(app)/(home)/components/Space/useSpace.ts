'use client'

import { useEffect, useState } from 'react'

import { useSpaceContext } from '@/contexts/SpaceContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE } from '@/utils/constants'

export function useSpace() {
  const localStorage = useLocalStorage()
  const hasTransitionAnimation = localStorage.hasItem(
    STORAGE.hasPageAnimationTransition
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
  }, [isTransitionVisible, localStorage])

  return {
    isTransitionVisible,
    lastUnlockedStarPosition,
    handleFabClick,
  }
}
