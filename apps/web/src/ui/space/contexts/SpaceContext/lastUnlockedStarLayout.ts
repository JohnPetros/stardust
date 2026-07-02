export type LastUnlockedStarLayoutMetrics = {
  starRect: DOMRect
  scrollContainer: HTMLElement | null
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  containerRect: DOMRect | null
}

const SCROLL_CENTER_TOLERANCE_IN_PX = 4

export function createLastUnlockedStarLayoutMetrics(
  starElement: HTMLDivElement,
  scrollContainer: HTMLElement | null,
): LastUnlockedStarLayoutMetrics {
  const starRect = starElement.getBoundingClientRect()

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
}

export function getLastUnlockedStarLayoutSnapshot(
  layoutMetrics: LastUnlockedStarLayoutMetrics,
) {
  const { starRect, scrollTop, scrollHeight, clientHeight, containerRect } = layoutMetrics

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
}

export function isLastUnlockedStarCentered(layoutMetrics: LastUnlockedStarLayoutMetrics) {
  const { starRect, containerRect, scrollContainer } = layoutMetrics
  const starCenter = starRect.top + starRect.height / 2

  if (scrollContainer && containerRect) {
    const viewportCenter = containerRect.top + containerRect.height / 2

    return Math.abs(starCenter - viewportCenter) <= SCROLL_CENTER_TOLERANCE_IN_PX
  }

  return Math.abs(starCenter - window.innerHeight / 2) <= SCROLL_CENTER_TOLERANCE_IN_PX
}

export function getLastUnlockedStarScrollTarget(
  layoutMetrics: LastUnlockedStarLayoutMetrics,
) {
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
}
