import { act, renderHook } from '@testing-library/react'

import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { User } from '@stardust/core/profile/entities'
import type { CurrentGalaxyDto } from '@stardust/core/space/entities/dtos'
import { PlanetsFaker, StarsFaker } from '@stardust/core/space/entities/fakers'

import { useSpaceContextProvider } from '../useSpaceContextProvider'

const currentGalaxy: CurrentGalaxyDto = {
  galaxy: {
    id: 'galaxy-id',
    slug: 'logica-de-programacao',
    name: 'Lógica de Programação',
  },
  isFirstGalaxy: true,
  hasGalaxyChoice: true,
}

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
  const refetchUser = jest.fn()
  const firstStar = StarsFaker.fake({ number: 1 })
  const secondStar = StarsFaker.fake({ number: 2 })
  const firstPlanet = PlanetsFaker.fake({
    position: 1,
    stars: [firstStar.dto, secondStar.dto],
  })
  const secondPlanet = PlanetsFaker.fake({
    position: 2,
    stars: [StarsFaker.fake({ number: 1 }).dto],
  })
  const planets = [firstPlanet, secondPlanet]

  function makeUser(facts: { completed?: string[]; opened?: string[] }) {
    return UsersFaker.fake({
      completedStarsIds: facts.completed ?? [],
      openedPlanetsIds: facts.opened ?? [],
    })
  }

  const Hook = (user: User | null = makeUser({})) =>
    renderHook(() => useSpaceContextProvider(planets, user, currentGalaxy, refetchUser))

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    jest.restoreAllMocks()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should not create a trail nor a current item without a user', () => {
    const { result } = Hook(null)

    expect(result.current.trail).toBeNull()
    expect(result.current.currentItem).toBeNull()
    expect(result.current.selectedStarId).toBeNull()
  })

  it('should point the current item to the first planet of a user without facts', () => {
    const { result } = Hook()

    expect(result.current.currentItem).toEqual({
      kind: 'planet',
      planetId: firstPlanet.id,
    })
    expect(result.current.selectedStarId).toBeNull()
  })

  it('should point the current item and the selected star to the available star', () => {
    const user = makeUser({
      opened: [firstPlanet.id.value],
      completed: [firstStar.id.value],
    })

    const { result } = Hook(user)

    expect(result.current.currentItem).toEqual({ kind: 'star', starId: secondStar.id })
    expect(result.current.selectedStarId).toBe(secondStar.id.value)
    expect(result.current.trail?.getStarState(firstStar.id).isCompleted.isTrue).toBe(true)
  })

  it('should keep the star details closed until they are opened', () => {
    const { result } = Hook()

    expect(result.current.isStarDetailsOpen).toBe(false)
    expect(result.current.hasGalaxyChoice).toBe(true)
    expect(result.current.galaxy.slug).toBe(currentGalaxy.galaxy.slug)
  })

  it('should expose the planets of the galaxy in the given order', () => {
    const { result } = Hook()

    expect(result.current.planets.map((planet) => planet.id.value)).toEqual([
      firstPlanet.id.value,
      secondPlanet.id.value,
    ])
    expect(result.current.isFirstGalaxy).toBe(true)
  })

  it('should keep the last selected star after selecting another one', () => {
    const user = makeUser({ opened: [firstPlanet.id.value] })
    const { result } = Hook(user)

    act(() => {
      result.current.selectStar(secondStar.id.value)
    })

    expect(result.current.selectedStarId).toBe(secondStar.id.value)
  })

  it('should open and close the star details', () => {
    const { result } = Hook()

    act(() => {
      result.current.openStarDetails()
    })
    expect(result.current.isStarDetailsOpen).toBe(true)

    act(() => {
      result.current.closeStarDetails()
    })
    expect(result.current.isStarDetailsOpen).toBe(false)
  })

  it('should restart only the registered animation of the star and unregister it', () => {
    const { result } = Hook()
    const restart = jest.fn()
    const animationRef = { current: { restart, stopAt: jest.fn(), setSpeed: jest.fn() } }
    let unregister = () => {}

    act(() => {
      unregister = result.current.registerStarAnimation('star-id', animationRef)
    })
    result.current.restartStarAnimation('star-id')
    result.current.restartStarAnimation('other-star-id')

    expect(restart).toHaveBeenCalledTimes(1)

    unregister()
    result.current.restartStarAnimation('star-id')

    expect(restart).toHaveBeenCalledTimes(1)
  })

  it('should reload the user when refreshing the trail', async () => {
    const { result } = Hook()

    await act(async () => {
      await result.current.refreshTrail()
    })

    expect(refetchUser).toHaveBeenCalledTimes(1)
  })

  it('should set the position to below when the current item is under the viewport', () => {
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
    const element = document.createElement('div')
    jest
      .spyOn(element, 'getBoundingClientRect')
      .mockReturnValue(createRect({ top: 1200, bottom: 1260 }))
    const { result } = Hook()
    ;(result.current.currentItemRef as { current: HTMLDivElement | null }).current =
      element

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.currentItemPosition).toBe('below')
  })

  it('should set the position to above when the current item is over the viewport', () => {
    const element = document.createElement('div')
    jest
      .spyOn(element, 'getBoundingClientRect')
      .mockReturnValue(createRect({ top: -60, bottom: -20 }))
    const { result } = Hook()
    ;(result.current.currentItemRef as { current: HTMLDivElement | null }).current =
      element

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.currentItemPosition).toBe('above')
  })

  it('should scroll the window to center the current item on demand', () => {
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true })
    const windowScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => undefined)
    const element = document.createElement('div')
    jest
      .spyOn(element, 'getBoundingClientRect')
      .mockReturnValue(createRect({ top: 300, bottom: 350, height: 50 }))
    const { result } = Hook()
    ;(result.current.currentItemRef as { current: HTMLDivElement | null }).current =
      element

    act(() => {
      result.current.scrollToCurrentItem()
    })

    expect(windowScrollTo).toHaveBeenCalledWith({ top: 25, behavior: 'smooth' })
  })

  it('should scroll once to the current item after the layout is stable and never again', () => {
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    const windowScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => undefined)
    const element = document.createElement('div')
    jest
      .spyOn(element, 'getBoundingClientRect')
      .mockReturnValue(createRect({ top: 300, bottom: 350, height: 50 }))
    const { result, rerender } = renderHook(
      ({ user }) => useSpaceContextProvider(planets, user, currentGalaxy, refetchUser),
      { initialProps: { user: makeUser({}) } },
    )
    ;(result.current.currentItemRef as { current: HTMLDivElement | null }).current =
      element

    act(() => {
      jest.advanceTimersByTime(3000)
    })
    const callsAfterFirstScroll = windowScrollTo.mock.calls.length

    rerender({ user: makeUser({ opened: [firstPlanet.id.value] }) })
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(callsAfterFirstScroll).toBeGreaterThan(0)
    expect(windowScrollTo.mock.calls.length).toBe(callsAfterFirstScroll)
  })

  it('should not scroll when there is no current item', () => {
    const windowScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => undefined)
    const allStarsIds = planets.flatMap((planet) =>
      planet.stars.map((star) => star.id.value),
    )
    const user = makeUser({
      opened: planets.map((planet) => planet.id.value),
      completed: allStarsIds,
    })

    const { result } = Hook(user)
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    expect(result.current.currentItem).toBeNull()
    expect(windowScrollTo).not.toHaveBeenCalled()
  })
})
