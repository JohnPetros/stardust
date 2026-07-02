import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { User } from '@stardust/core/profile/entities'
import type { Planet } from '@stardust/core/space/entities'

import {
  createLastUnlockedStarLayoutMetrics,
  getLastUnlockedStarLayoutSnapshot,
  getLastUnlockedStarScrollTarget,
  isLastUnlockedStarCentered,
} from './lastUnlockedStarLayout'
import type { LastUnlockedStarViewPortPosition } from './types'

const MAX_SCROLL_RECENTER_ATTEMPTS = 6
const SCROLL_RECENTER_DELAY_IN_MS = 150

export function useSpaceContextProvider(planets: Planet[], user: User | null) {
  const [lastUnlockedStarPosition, setLastUnlockedStarPosition] =
    useState<LastUnlockedStarViewPortPosition>('above')
  const lastUnlockedStarRef = useRef<HTMLDivElement | null>(null)
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  const lastUnlockedStarId = useMemo(() => {
    if (!user) return null

    const reversedPlanets = [...planets]
    reversedPlanets.reverse()

    for (const planet of reversedPlanets) {
      const reversedStars = [...planet.stars]
      reversedStars.reverse()

      for (const star of reversedStars) {
        const isUnlocked = user.hasUnlockedStar(star.id)

        if (isUnlocked.isTrue) {
          return star.id.value
        }
      }
    }

    const firstStarId = planets[0]?.stars[0]?.id
    return firstStarId?.value
  }, [user, planets])

  const resolveScrollContainer = useCallback(() => {
    const starElement = lastUnlockedStarRef.current

    if (!starElement) {
      scrollContainerRef.current = null
      return null
    }

    const cachedContainer = scrollContainerRef.current

    if (cachedContainer && cachedContainer.contains(starElement)) {
      const cachedContainerStyles = window.getComputedStyle(cachedContainer)
      const isCachedContainerScrollableByStyles =
        cachedContainerStyles.overflowY === 'auto' ||
        cachedContainerStyles.overflowY === 'scroll' ||
        cachedContainerStyles.overflowY === 'overlay'

      if (isCachedContainerScrollableByStyles) {
        return cachedContainer
      }
    }

    let parentElement = starElement.parentElement

    while (parentElement) {
      const styles = window.getComputedStyle(parentElement)
      const isScrollableByStyles =
        styles.overflowY === 'auto' ||
        styles.overflowY === 'scroll' ||
        styles.overflowY === 'overlay'

      if (isScrollableByStyles) {
        scrollContainerRef.current = parentElement
        return parentElement
      }

      parentElement = parentElement.parentElement
    }

    scrollContainerRef.current = null
    return null
  }, [])

  const getLastUnlockedStarLayoutMetrics = useCallback(() => {
    const starElement = lastUnlockedStarRef.current

    if (!starElement) {
      return null
    }

    return createLastUnlockedStarLayoutMetrics(starElement, resolveScrollContainer())
  }, [resolveScrollContainer])

  const handleGetLastUnlockedStarLayoutSnapshot = useCallback(() => {
    const layoutMetrics = getLastUnlockedStarLayoutMetrics()

    if (!layoutMetrics) {
      return null
    }

    return getLastUnlockedStarLayoutSnapshot(layoutMetrics)
  }, [getLastUnlockedStarLayoutMetrics])

  const handleScroll = useCallback(() => {
    const starRect = lastUnlockedStarRef.current?.getBoundingClientRect()

    if (!starRect) return

    const scrollContainer = resolveScrollContainer()

    if (scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect()

      if (starRect.top > containerRect.bottom) {
        setLastUnlockedStarPosition('above')
        return
      }

      if (starRect.bottom < containerRect.top) {
        setLastUnlockedStarPosition('bellow')
        return
      }

      setLastUnlockedStarPosition('in')
      return
    }

    if (starRect.top > window.innerHeight) {
      setLastUnlockedStarPosition('above')
      return
    }

    if (starRect.bottom < 0) {
      setLastUnlockedStarPosition('bellow')
      return
    }

    setLastUnlockedStarPosition('in')
  }, [resolveScrollContainer])

  const scrollIntoLastUnlockedStar = useCallback(() => {
    function recenterLastUnlockedStar(remainingAttempts: number) {
      const layoutMetrics = getLastUnlockedStarLayoutMetrics()

      if (!layoutMetrics) return

      const nextScrollTop = getLastUnlockedStarScrollTarget(layoutMetrics)

      if (layoutMetrics.scrollContainer) {
        layoutMetrics.scrollContainer.scrollTo({
          top: nextScrollTop,
          behavior: 'smooth',
        })
      } else {
        window.scrollTo({
          top: nextScrollTop,
          behavior: 'smooth',
        })
      }

      if (remainingAttempts <= 0) {
        return
      }

      window.setTimeout(() => {
        const nextLayoutMetrics = getLastUnlockedStarLayoutMetrics()

        if (!nextLayoutMetrics || isLastUnlockedStarCentered(nextLayoutMetrics)) {
          return
        }

        recenterLastUnlockedStar(remainingAttempts - 1)
      }, SCROLL_RECENTER_DELAY_IN_MS)
    }

    recenterLastUnlockedStar(MAX_SCROLL_RECENTER_ATTEMPTS)
  }, [getLastUnlockedStarLayoutMetrics])

  useEffect(() => {
    const targets: Array<HTMLElement | Window> = []

    function registerTarget(target: HTMLElement | Window) {
      if (targets.includes(target)) {
        return
      }

      target.addEventListener('scroll', handleScroll, { passive: true })
      targets.push(target)
    }

    registerTarget(window)

    const initialScrollContainer = resolveScrollContainer()

    if (initialScrollContainer) {
      registerTarget(initialScrollContainer)
    }

    handleScroll()

    const animationFrameId = window.requestAnimationFrame(() => {
      const delayedScrollContainer = resolveScrollContainer()

      if (delayedScrollContainer) {
        registerTarget(delayedScrollContainer)
      }

      handleScroll()
    })

    return () => {
      window.cancelAnimationFrame(animationFrameId)

      for (const target of targets) {
        target.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll, resolveScrollContainer, lastUnlockedStarId])

  const spaceContextValue = useMemo(() => {
    return {
      planets,
      lastUnlockedStarId,
      lastUnlockedStarRef,
      lastUnlockedStarPosition,
      getLastUnlockedStarLayoutSnapshot: handleGetLastUnlockedStarLayoutSnapshot,
      scrollIntoLastUnlockedStar,
      setLastUnlockedStarPosition,
    }
  }, [
    planets,
    lastUnlockedStarId,
    lastUnlockedStarPosition,
    handleGetLastUnlockedStarLayoutSnapshot,
    scrollIntoLastUnlockedStar,
  ])

  return spaceContextValue
}
