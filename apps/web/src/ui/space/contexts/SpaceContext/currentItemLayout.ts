export type CurrentItemLayoutMetrics = {
  itemRect: DOMRect
  scrollContainer: HTMLElement | null
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  containerRect: DOMRect | null
}

const SCROLL_CENTER_TOLERANCE_IN_PX = 4

export function createCurrentItemLayoutMetrics(
  itemElement: HTMLDivElement,
  scrollContainer: HTMLElement | null,
): CurrentItemLayoutMetrics {
  const itemRect = itemElement.getBoundingClientRect()

  if (scrollContainer) {
    return {
      itemRect,
      scrollContainer,
      scrollTop: scrollContainer.scrollTop,
      scrollHeight: scrollContainer.scrollHeight,
      clientHeight: scrollContainer.clientHeight,
      containerRect: scrollContainer.getBoundingClientRect(),
    }
  }

  return {
    itemRect,
    scrollContainer: null,
    scrollTop: window.scrollY,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: window.innerHeight,
    containerRect: null,
  }
}

export function getCurrentItemLayoutSnapshot(layoutMetrics: CurrentItemLayoutMetrics) {
  const { itemRect, scrollTop, scrollHeight, clientHeight, containerRect } = layoutMetrics

  return [
    Math.round(itemRect.top),
    Math.round(itemRect.bottom),
    Math.round(itemRect.height),
    Math.round(scrollTop),
    Math.round(scrollHeight),
    Math.round(clientHeight),
    Math.round(containerRect?.top ?? 0),
    Math.round(containerRect?.bottom ?? 0),
    Math.round(containerRect?.height ?? 0),
  ].join(':')
}

export function isCurrentItemCentered(layoutMetrics: CurrentItemLayoutMetrics) {
  const { itemRect, containerRect, scrollContainer } = layoutMetrics
  const starCenter = itemRect.top + itemRect.height / 2

  if (scrollContainer && containerRect) {
    const viewportCenter = containerRect.top + containerRect.height / 2

    return Math.abs(starCenter - viewportCenter) <= SCROLL_CENTER_TOLERANCE_IN_PX
  }

  return Math.abs(starCenter - window.innerHeight / 2) <= SCROLL_CENTER_TOLERANCE_IN_PX
}

export function getCurrentItemScrollTarget(layoutMetrics: CurrentItemLayoutMetrics) {
  const { itemRect, scrollContainer, containerRect } = layoutMetrics

  if (scrollContainer && containerRect) {
    return (
      scrollContainer.scrollTop +
      (itemRect.top - containerRect.top) -
      (scrollContainer.clientHeight - itemRect.height) / 2
    )
  }

  const starTopPosition = itemRect.top + window.scrollY
  return starTopPosition - (window.innerHeight - itemRect.height) / 2
}
