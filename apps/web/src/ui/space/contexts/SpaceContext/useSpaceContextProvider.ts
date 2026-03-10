import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { User } from '@stardust/core/profile/entities'
import type { Planet } from '@stardust/core/space/entities'

import type { LastUnlockedStarViewPortPosition } from './types'

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
    const starElement = lastUnlockedStarRef.current

    if (!starElement) return

    const starRect = starElement.getBoundingClientRect()

    if (!starRect) return

    const scrollContainer = resolveScrollContainer()

    if (scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect()
      const starPositionWithinContainer =
        scrollContainer.scrollTop +
        (starRect.top - containerRect.top) -
        (scrollContainer.clientHeight - starRect.height) / 2

      scrollContainer.scrollTo({
        top: starPositionWithinContainer,
        behavior: 'smooth',
      })

      return
    }

    const starTopPosition = starRect.top + window.scrollY
    const starPosition = starTopPosition - (window.innerHeight - starRect.height) / 2

    window.scrollTo({
      top: starPosition,
      behavior: 'smooth',
    })
  }, [resolveScrollContainer])

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
      scrollIntoLastUnlockedStar,
      setLastUnlockedStarPosition,
    }
  }, [planets, lastUnlockedStarId, lastUnlockedStarPosition, scrollIntoLastUnlockedStar])

  return spaceContextValue
}
