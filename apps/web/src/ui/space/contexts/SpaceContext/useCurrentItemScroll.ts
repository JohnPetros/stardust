import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  createCurrentItemLayoutMetrics,
  getCurrentItemLayoutSnapshot,
  getCurrentItemScrollTarget,
  isCurrentItemCentered,
} from './currentItemLayout'
import type { CurrentItemViewportPosition } from './types'

const MAX_SCROLL_RECENTER_ATTEMPTS = 6
const SCROLL_RECENTER_DELAY_IN_MS = 150

function isScrollableByStyles(element: HTMLElement) {
  const { overflowY } = window.getComputedStyle(element)

  return overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay'
}

function findScrollableAncestor(itemElement: HTMLElement) {
  let parentElement = itemElement.parentElement

  while (parentElement) {
    if (isScrollableByStyles(parentElement)) return parentElement

    parentElement = parentElement.parentElement
  }

  return null
}

function getViewPortPosition(
  itemRect: DOMRect,
  scrollContainer: HTMLElement | null,
): CurrentItemViewportPosition {
  const containerRect = scrollContainer?.getBoundingClientRect()
  const top = containerRect ? containerRect.top : 0
  const bottom = containerRect ? containerRect.bottom : window.innerHeight

  if (itemRect.top > bottom) return 'below'
  if (itemRect.bottom < top) return 'above'

  return 'in'
}

function useScrollContainerResolver(currentItemRef: RefObject<HTMLDivElement | null>) {
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  return useCallback(() => {
    const itemElement = currentItemRef.current

    if (!itemElement) {
      scrollContainerRef.current = null
      return null
    }

    const cachedContainer = scrollContainerRef.current

    if (
      cachedContainer &&
      cachedContainer.contains(itemElement) &&
      isScrollableByStyles(cachedContainer)
    ) {
      return cachedContainer
    }

    scrollContainerRef.current = findScrollableAncestor(itemElement)
    return scrollContainerRef.current
  }, [currentItemRef])
}

function useLayoutMetrics(
  currentItemRef: RefObject<HTMLDivElement | null>,
  resolveScrollContainer: () => HTMLElement | null,
) {
  return useCallback(() => {
    const itemElement = currentItemRef.current

    if (!itemElement) {
      return null
    }

    return createCurrentItemLayoutMetrics(itemElement, resolveScrollContainer())
  }, [currentItemRef, resolveScrollContainer])
}

type GetLayoutMetrics = ReturnType<typeof useLayoutMetrics>

function scrollToCurrentItem(layoutMetrics: NonNullable<ReturnType<GetLayoutMetrics>>) {
  const scrollOptions: ScrollToOptions = {
    top: getCurrentItemScrollTarget(layoutMetrics),
    behavior: 'smooth',
  }

  if (layoutMetrics.scrollContainer) {
    layoutMetrics.scrollContainer.scrollTo(scrollOptions)
    return
  }

  window.scrollTo(scrollOptions)
}

function recenterCurrentItem(
  getLayoutMetrics: GetLayoutMetrics,
  remainingAttempts: number,
) {
  const layoutMetrics = getLayoutMetrics()

  if (!layoutMetrics) return

  scrollToCurrentItem(layoutMetrics)

  if (remainingAttempts <= 0) {
    return
  }

  window.setTimeout(() => {
    const nextLayoutMetrics = getLayoutMetrics()

    if (!nextLayoutMetrics || isCurrentItemCentered(nextLayoutMetrics)) {
      return
    }

    recenterCurrentItem(getLayoutMetrics, remainingAttempts - 1)
  }, SCROLL_RECENTER_DELAY_IN_MS)
}

function useScrollIntoCurrentItem(getLayoutMetrics: GetLayoutMetrics) {
  return useCallback(() => {
    recenterCurrentItem(getLayoutMetrics, MAX_SCROLL_RECENTER_ATTEMPTS)
  }, [getLayoutMetrics])
}

function subscribeScrollListeners(
  handleScroll: () => void,
  resolveScrollContainer: () => HTMLElement | null,
) {
  const targets: Array<HTMLElement | Window> = []

  function registerTarget(target: HTMLElement | Window | null) {
    if (!target || targets.includes(target)) {
      return
    }

    target.addEventListener('scroll', handleScroll, { passive: true })
    targets.push(target)
  }

  registerTarget(window)
  registerTarget(resolveScrollContainer())
  handleScroll()

  const animationFrameId = window.requestAnimationFrame(() => {
    registerTarget(resolveScrollContainer())
    handleScroll()
  })

  return () => {
    window.cancelAnimationFrame(animationFrameId)

    for (const target of targets) {
      target.removeEventListener('scroll', handleScroll)
    }
  }
}

function useScrollListeners(
  handleScroll: () => void,
  resolveScrollContainer: () => HTMLElement | null,
  currentItemId: string | null | undefined,
) {
  useEffect(() => {
    return subscribeScrollListeners(handleScroll, resolveScrollContainer)
  }, [handleScroll, resolveScrollContainer, currentItemId])
}

function useLayoutSnapshot(getLayoutMetrics: ReturnType<typeof useLayoutMetrics>) {
  return useCallback(() => {
    const layoutMetrics = getLayoutMetrics()

    if (!layoutMetrics) {
      return null
    }

    return getCurrentItemLayoutSnapshot(layoutMetrics)
  }, [getLayoutMetrics])
}

function useViewPortPositionTracking(
  currentItemRef: RefObject<HTMLDivElement | null>,
  resolveScrollContainer: () => HTMLElement | null,
) {
  const [currentItemPosition, setCurrentItemPosition] =
    useState<CurrentItemViewportPosition>('in')

  const handleScroll = useCallback(() => {
    const itemRect = currentItemRef.current?.getBoundingClientRect()

    if (!itemRect) return

    setCurrentItemPosition(getViewPortPosition(itemRect, resolveScrollContainer()))
  }, [currentItemRef, resolveScrollContainer])

  return { currentItemPosition, setCurrentItemPosition, handleScroll }
}

const STABLE_LAYOUT_POLL_DELAY_IN_MS = 100
const STABLE_LAYOUT_REQUIRED_ITERATIONS = 2
const STABLE_LAYOUT_MAX_ATTEMPTS = 30

type StableLayoutWaiterParams = {
  currentItemRef: RefObject<HTMLDivElement | null>
  getCurrentItemLayoutSnapshot: () => string | null
  onStable: () => void
}

function waitForStableLayout({
  currentItemRef,
  getCurrentItemLayoutSnapshot,
  onStable,
}: StableLayoutWaiterParams) {
  let attempts = 0
  let stableIterations = 0
  let previousSnapshot = getCurrentItemLayoutSnapshot()
  let timeout: number | undefined

  function check() {
    const currentSnapshot = getCurrentItemLayoutSnapshot()
    if (!currentItemRef.current || !currentSnapshot) return

    attempts += 1
    stableIterations = currentSnapshot === previousSnapshot ? stableIterations + 1 : 0
    previousSnapshot = currentSnapshot

    if (
      stableIterations >= STABLE_LAYOUT_REQUIRED_ITERATIONS ||
      attempts >= STABLE_LAYOUT_MAX_ATTEMPTS
    ) {
      onStable()
      return
    }

    timeout = window.setTimeout(check, STABLE_LAYOUT_POLL_DELAY_IN_MS)
  }

  timeout = window.setTimeout(check, STABLE_LAYOUT_POLL_DELAY_IN_MS)

  return () => window.clearTimeout(timeout)
}

type InitialScrollParams = {
  currentItemId: string | null | undefined
  currentItemRef: RefObject<HTMLDivElement | null>
  getCurrentItemLayoutSnapshot: () => string | null
  scrollIntoCurrentItem: () => void
}

function useInitialScroll({
  currentItemId,
  currentItemRef,
  getCurrentItemLayoutSnapshot,
  scrollIntoCurrentItem,
}: InitialScrollParams) {
  const hasScrolled = useRef(false)

  useEffect(() => {
    if (!currentItemId || hasScrolled.current) return

    return waitForStableLayout({
      currentItemRef,
      getCurrentItemLayoutSnapshot,
      onStable() {
        scrollIntoCurrentItem()
        hasScrolled.current = true
      },
    })
  }, [currentItemId, currentItemRef, getCurrentItemLayoutSnapshot, scrollIntoCurrentItem])
}

export function useCurrentItemScroll(currentItemId: string | null | undefined) {
  const currentItemRef = useRef<HTMLDivElement | null>(null)

  const resolveScrollContainer = useScrollContainerResolver(currentItemRef)
  const getLayoutMetrics = useLayoutMetrics(currentItemRef, resolveScrollContainer)
  const scrollToCurrentItem = useScrollIntoCurrentItem(getLayoutMetrics)
  const getCurrentItemLayoutSnapshot = useLayoutSnapshot(getLayoutMetrics)
  const { currentItemPosition, setCurrentItemPosition, handleScroll } =
    useViewPortPositionTracking(currentItemRef, resolveScrollContainer)

  useScrollListeners(handleScroll, resolveScrollContainer, currentItemId)
  useInitialScroll({
    currentItemId,
    currentItemRef,
    getCurrentItemLayoutSnapshot,
    scrollIntoCurrentItem: scrollToCurrentItem,
  })

  return useMemo(
    () => ({
      currentItemRef,
      currentItemPosition,
      setCurrentItemPosition,
      getCurrentItemLayoutSnapshot,
      scrollToCurrentItem,
    }),
    [
      currentItemPosition,
      setCurrentItemPosition,
      getCurrentItemLayoutSnapshot,
      scrollToCurrentItem,
    ],
  )
}
