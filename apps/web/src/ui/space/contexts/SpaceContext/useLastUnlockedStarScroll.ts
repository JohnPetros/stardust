import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

import {
  createLastUnlockedStarLayoutMetrics,
  getLastUnlockedStarLayoutSnapshot,
  getLastUnlockedStarScrollTarget,
  isLastUnlockedStarCentered,
} from './lastUnlockedStarLayout'
import type { LastUnlockedStarViewPortPosition } from './types'

const MAX_SCROLL_RECENTER_ATTEMPTS = 6
const SCROLL_RECENTER_DELAY_IN_MS = 150

function isScrollableByStyles(element: HTMLElement) {
  const { overflowY } = window.getComputedStyle(element)

  return overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay'
}

function findScrollableAncestor(starElement: HTMLElement) {
  let parentElement = starElement.parentElement

  while (parentElement) {
    if (isScrollableByStyles(parentElement)) return parentElement

    parentElement = parentElement.parentElement
  }

  return null
}

function getViewPortPosition(
  starRect: DOMRect,
  scrollContainer: HTMLElement | null,
): LastUnlockedStarViewPortPosition {
  const containerRect = scrollContainer?.getBoundingClientRect()
  const top = containerRect ? containerRect.top : 0
  const bottom = containerRect ? containerRect.bottom : window.innerHeight

  if (starRect.top > bottom) return 'above'
  if (starRect.bottom < top) return 'bellow'

  return 'in'
}

function useScrollContainerResolver(
  lastUnlockedStarRef: RefObject<HTMLDivElement | null>,
) {
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  return useCallback(() => {
    const starElement = lastUnlockedStarRef.current

    if (!starElement) {
      scrollContainerRef.current = null
      return null
    }

    const cachedContainer = scrollContainerRef.current

    if (
      cachedContainer &&
      cachedContainer.contains(starElement) &&
      isScrollableByStyles(cachedContainer)
    ) {
      return cachedContainer
    }

    scrollContainerRef.current = findScrollableAncestor(starElement)
    return scrollContainerRef.current
  }, [lastUnlockedStarRef])
}

function useLayoutMetrics(
  lastUnlockedStarRef: RefObject<HTMLDivElement | null>,
  resolveScrollContainer: () => HTMLElement | null,
) {
  return useCallback(() => {
    const starElement = lastUnlockedStarRef.current

    if (!starElement) {
      return null
    }

    return createLastUnlockedStarLayoutMetrics(starElement, resolveScrollContainer())
  }, [lastUnlockedStarRef, resolveScrollContainer])
}

function useScrollIntoLastUnlockedStar(
  getLayoutMetrics: ReturnType<typeof useLayoutMetrics>,
) {
  return useCallback(() => {
    function recenterLastUnlockedStar(remainingAttempts: number) {
      const layoutMetrics = getLayoutMetrics()

      if (!layoutMetrics) return

      const scrollOptions: ScrollToOptions = {
        top: getLastUnlockedStarScrollTarget(layoutMetrics),
        behavior: 'smooth',
      }

      if (layoutMetrics.scrollContainer) {
        layoutMetrics.scrollContainer.scrollTo(scrollOptions)
      } else {
        window.scrollTo(scrollOptions)
      }

      if (remainingAttempts <= 0) {
        return
      }

      window.setTimeout(() => {
        const nextLayoutMetrics = getLayoutMetrics()

        if (!nextLayoutMetrics || isLastUnlockedStarCentered(nextLayoutMetrics)) {
          return
        }

        recenterLastUnlockedStar(remainingAttempts - 1)
      }, SCROLL_RECENTER_DELAY_IN_MS)
    }

    recenterLastUnlockedStar(MAX_SCROLL_RECENTER_ATTEMPTS)
  }, [getLayoutMetrics])
}

function useScrollListeners(
  handleScroll: () => void,
  resolveScrollContainer: () => HTMLElement | null,
  lastUnlockedStarId: string | null | undefined,
) {
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
}

function useLayoutSnapshot(getLayoutMetrics: ReturnType<typeof useLayoutMetrics>) {
  return useCallback(() => {
    const layoutMetrics = getLayoutMetrics()

    if (!layoutMetrics) {
      return null
    }

    return getLastUnlockedStarLayoutSnapshot(layoutMetrics)
  }, [getLayoutMetrics])
}

function useViewPortPositionTracking(
  lastUnlockedStarRef: RefObject<HTMLDivElement | null>,
  resolveScrollContainer: () => HTMLElement | null,
) {
  const [lastUnlockedStarPosition, setLastUnlockedStarPosition] =
    useState<LastUnlockedStarViewPortPosition>('above')

  const handleScroll = useCallback(() => {
    const starRect = lastUnlockedStarRef.current?.getBoundingClientRect()

    if (!starRect) return

    setLastUnlockedStarPosition(getViewPortPosition(starRect, resolveScrollContainer()))
  }, [lastUnlockedStarRef, resolveScrollContainer])

  return { lastUnlockedStarPosition, setLastUnlockedStarPosition, handleScroll }
}

export function useLastUnlockedStarScroll(lastUnlockedStarId: string | null | undefined) {
  const lastUnlockedStarRef = useRef<HTMLDivElement | null>(null)

  const resolveScrollContainer = useScrollContainerResolver(lastUnlockedStarRef)
  const getLayoutMetrics = useLayoutMetrics(lastUnlockedStarRef, resolveScrollContainer)
  const scrollIntoLastUnlockedStar = useScrollIntoLastUnlockedStar(getLayoutMetrics)
  const getLastUnlockedStarLayoutSnapshot = useLayoutSnapshot(getLayoutMetrics)
  const { lastUnlockedStarPosition, setLastUnlockedStarPosition, handleScroll } =
    useViewPortPositionTracking(lastUnlockedStarRef, resolveScrollContainer)

  useScrollListeners(handleScroll, resolveScrollContainer, lastUnlockedStarId)

  return {
    lastUnlockedStarRef,
    lastUnlockedStarPosition,
    setLastUnlockedStarPosition,
    getLastUnlockedStarLayoutSnapshot,
    scrollIntoLastUnlockedStar,
  }
}
