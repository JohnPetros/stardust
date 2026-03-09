import { act, renderHook } from '@testing-library/react'

import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import { PlanetsFaker, StarsFaker } from '@stardust/core/space/entities/fakers'

import { useSpaceContextProvider } from '../useSpaceContextProvider'

function createRect({
  top,
  bottom,
  height,
}: {
  top: number
  bottom: number
  height?: number
}) {
  return {
    x: 0,
    y: top,
    left: 0,
    right: 0,
    width: 0,
    top,
    bottom,
    height: height ?? bottom - top,
    toJSON: () => ({}),
  } as DOMRect
}

describe('useSpaceContextProvider', () => {
  const setLastUnlockedStarRef = (ref: unknown, element: HTMLDivElement) => {
    ;(ref as { current: HTMLDivElement | null }).current = element
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('should return null as last unlocked star id when user is null', () => {
    const planets = PlanetsFaker.fakeMany(2)

    const { result } = renderHook(() => useSpaceContextProvider(planets, null))

    expect(result.current.lastUnlockedStarId).toBeNull()
  })

  it('should return most recent unlocked star id from planets', () => {
    const firstPlanetUnlockedStar = StarsFaker.fake({ number: 1 })
    const secondPlanetUnlockedStar = StarsFaker.fake({ number: 1 })

    const planets = [
      PlanetsFaker.fake({
        position: 1,
        stars: [firstPlanetUnlockedStar.dto, StarsFaker.fake({ number: 2 }).dto],
      }),
      PlanetsFaker.fake({
        position: 2,
        stars: [secondPlanetUnlockedStar.dto],
      }),
    ]

    const user = UsersFaker.fake({
      unlockedStarsIds: [
        firstPlanetUnlockedStar.id.value,
        secondPlanetUnlockedStar.id.value,
      ],
    })

    const { result } = renderHook(() => useSpaceContextProvider(planets, user))

    expect(result.current.lastUnlockedStarId).toBe(secondPlanetUnlockedStar.id.value)
  })

  it('should fallback to first star id when user has no unlocked stars', () => {
    const firstStar = StarsFaker.fake({ number: 1 })
    const planets = [
      PlanetsFaker.fake({
        stars: [firstStar.dto, StarsFaker.fake({ number: 2 }).dto],
      }),
    ]
    const user = UsersFaker.fake({ unlockedStarsIds: [] })

    const { result } = renderHook(() => useSpaceContextProvider(planets, user))

    expect(result.current.lastUnlockedStarId).toBe(firstStar.id.value)
  })

  it('should set last unlocked star position to above when star is below viewport', () => {
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
    const planets = PlanetsFaker.fakeMany(1)
    const user = UsersFaker.fake()
    const starElement = document.createElement('div')

    jest
      .spyOn(starElement, 'getBoundingClientRect')
      .mockReturnValue(createRect({ top: 1200, bottom: 1260 }))

    const { result } = renderHook(() => useSpaceContextProvider(planets, user))

    setLastUnlockedStarRef(result.current.lastUnlockedStarRef, starElement)

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.lastUnlockedStarPosition).toBe('above')
  })

  it('should set last unlocked star position to bellow when star is above viewport', () => {
    const planets = PlanetsFaker.fakeMany(1)
    const user = UsersFaker.fake()
    const starElement = document.createElement('div')

    jest
      .spyOn(starElement, 'getBoundingClientRect')
      .mockReturnValue(createRect({ top: -60, bottom: -20 }))

    const { result } = renderHook(() => useSpaceContextProvider(planets, user))

    setLastUnlockedStarRef(result.current.lastUnlockedStarRef, starElement)

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.lastUnlockedStarPosition).toBe('bellow')
  })

  it('should scroll window to center last unlocked star', () => {
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true })

    const planets = PlanetsFaker.fakeMany(1)
    const user = UsersFaker.fake()
    const starElement = document.createElement('div')
    const windowScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => undefined)

    jest
      .spyOn(starElement, 'getBoundingClientRect')
      .mockReturnValue(createRect({ top: 300, bottom: 350, height: 50 }))

    const { result } = renderHook(() => useSpaceContextProvider(planets, user))

    setLastUnlockedStarRef(result.current.lastUnlockedStarRef, starElement)

    act(() => {
      result.current.scrollIntoLastUnlockedStar()
    })

    expect(windowScrollTo).toHaveBeenCalledWith({
      top: 25,
      behavior: 'smooth',
    })
  })

  it('should scroll parent container to center last unlocked star', () => {
    const planets = PlanetsFaker.fakeMany(1)
    const user = UsersFaker.fake()
    const starElement = document.createElement('div')
    const scrollContainer = document.createElement('section')
    const containerScrollTo = jest.fn()

    scrollContainer.style.overflowY = 'auto'
    Object.defineProperty(scrollContainer, 'scrollHeight', {
      value: 600,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'clientHeight', {
      value: 200,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'scrollTop', {
      value: 120,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(scrollContainer, 'scrollTo', {
      value: containerScrollTo,
      configurable: true,
    })

    scrollContainer.appendChild(starElement)
    document.body.appendChild(scrollContainer)

    jest
      .spyOn(starElement, 'getBoundingClientRect')
      .mockReturnValue(createRect({ top: 300, bottom: 340, height: 40 }))
    jest
      .spyOn(scrollContainer, 'getBoundingClientRect')
      .mockReturnValue(createRect({ top: 100, bottom: 500, height: 400 }))

    const { result } = renderHook(() => useSpaceContextProvider(planets, user))

    setLastUnlockedStarRef(result.current.lastUnlockedStarRef, starElement)

    act(() => {
      result.current.scrollIntoLastUnlockedStar()
    })

    expect(containerScrollTo).toHaveBeenCalledWith({
      top: 240,
      behavior: 'smooth',
    })
  })

  it('should track scroll position on container after user refetch', () => {
    const unlockedStar = StarsFaker.fake({ number: 1 })
    const planets = [
      PlanetsFaker.fake({
        stars: [unlockedStar.dto, StarsFaker.fake({ number: 2 }).dto],
      }),
    ]
    const scrollContainer = document.createElement('section')
    const starElement = document.createElement('div')

    scrollContainer.style.overflowY = 'auto'
    Object.defineProperty(scrollContainer, 'scrollHeight', {
      value: 600,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'clientHeight', {
      value: 400,
      configurable: true,
    })

    scrollContainer.appendChild(starElement)
    document.body.appendChild(scrollContainer)

    jest
      .spyOn(starElement, 'getBoundingClientRect')
      .mockReturnValue(createRect({ top: 700, bottom: 760 }))
    jest
      .spyOn(scrollContainer, 'getBoundingClientRect')
      .mockReturnValue(createRect({ top: 0, bottom: 500 }))

    const { result, rerender } = renderHook(
      ({ user }) => useSpaceContextProvider(planets, user),
      {
        initialProps: { user: null as ReturnType<typeof UsersFaker.fake> | null },
      },
    )

    setLastUnlockedStarRef(result.current.lastUnlockedStarRef, starElement)

    rerender({
      user: UsersFaker.fake({ unlockedStarsIds: [unlockedStar.id.value] }),
    })

    act(() => {
      scrollContainer.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.lastUnlockedStarPosition).toBe('above')
  })
})
