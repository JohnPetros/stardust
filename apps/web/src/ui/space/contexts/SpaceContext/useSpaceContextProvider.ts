import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { User } from '@stardust/core/profile/entities'
import type { Planet } from '@stardust/core/space/entities'

import type { LastUnlockedStarViewPortPosition } from './types'

type LastUnlockedStarLayoutMetrics = {
  starRect: DOMRect
  scrollContainer: HTMLElement | null
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  containerRect: DOMRect | null
}

const MAX_SCROLL_RECENTER_ATTEMPTS = 6
const SCROLL_RECENTER_DELAY_IN_MS = 150
const SCROLL_CENTER_TOLERANCE_IN_PX = 4

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

    const starRect = starElement.getBoundingClientRect()
    const scrollContainer = resolveScrollContainer()

    if (scrollContainer) {
      return {
        starRect,
        scrollContainer,
        scrollTop: scrollContainer.scrollTop,
        scrollHeight: scrollContainer.scrollHeight,
        clientHeight: scrollContainer.clientHeight,
        containerRect: scrollContainer.getBoundingClientRect(),
      }
    }

    return {
      starRect,
      scrollContainer: null,
      scrollTop: window.scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: window.innerHeight,
      containerRect: null,
    }
  }, [resolveScrollContainer])

  const getLastUnlockedStarLayoutSnapshot = useCallback(() => {
    const layoutMetrics = getLastUnlockedStarLayoutMetrics()

    if (!layoutMetrics) {
      return null
    }

    const { starRect, scrollTop, scrollHeight, clientHeight, containerRect } =
      layoutMetrics

    return [
      Math.round(starRect.top),
      Math.round(starRect.bottom),
      Math.round(starRect.height),
      Math.round(scrollTop),
      Math.round(scrollHeight),
      Math.round(clientHeight),
      Math.round(containerRect?.top ?? 0),
      Math.round(containerRect?.bottom ?? 0),
      Math.round(containerRect?.height ?? 0),
    ].join(':')
  }, [getLastUnlockedStarLayoutMetrics])

  const isLastUnlockedStarCentered = useCallback(
    (layoutMetrics: LastUnlockedStarLayoutMetrics) => {
      const { starRect, containerRect, scrollContainer } = layoutMetrics
      const starCenter = starRect.top + starRect.height / 2
      const viewportCenter = scrollContainer
        ? containerRect!.top + containerRect!.height / 2
        : window.innerHeight / 2

      return Math.abs(starCenter - viewportCenter) <= SCROLL_CENTER_TOLERANCE_IN_PX
    },
    [],
  )

  const getLastUnlockedStarScrollTarget = useCallback(
    (layoutMetrics: LastUnlockedStarLayoutMetrics) => {
      const { starRect, scrollContainer, containerRect } = layoutMetrics

      if (scrollContainer && containerRect) {
        return (
          scrollContainer.scrollTop +
          (starRect.top - containerRect.top) -
          (scrollContainer.clientHeight - starRect.height) / 2
        )
      }

      const starTopPosition = starRect.top + window.scrollY
      return starTopPosition - (window.innerHeight - starRect.height) / 2
    },
    [],
  )

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
  }, [
    getLastUnlockedStarLayoutMetrics,
    getLastUnlockedStarScrollTarget,
    isLastUnlockedStarCentered,
  ])

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
      getLastUnlockedStarLayoutSnapshot,
      scrollIntoLastUnlockedStar,
      setLastUnlockedStarPosition,
    }
  }, [
    planets,
    lastUnlockedStarId,
    lastUnlockedStarPosition,
    getLastUnlockedStarLayoutSnapshot,
    scrollIntoLastUnlockedStar,
  ])

  return spaceContextValue
}
