import { act, renderHook } from '@testing-library/react'

import { Id, IdsList } from '@stardust/core/global/structures'
import { Planet } from '@stardust/core/space/entities'
import { PlanetsFaker } from '@stardust/core/space/entities/fakers'
import { GalaxyTrail } from '@stardust/core/space/structures'

import { type Params, usePlanet } from '../usePlanet'

describe('usePlanet', () => {
  const planet = Planet.create(PlanetsFaker.fakeDto({ name: 'Aurora', position: 1 }))
  let openPlanet: jest.Mock
  let refreshTrail: jest.Mock
  let showError: jest.Mock

  function makeTrail(opened: boolean) {
    return GalaxyTrail.create({
      planets: [planet],
      completedStarsIds: IdsList.create([]),
      openedPlanetsIds: IdsList.create(opened ? [planet.id.value] : []),
    })
  }

  const Hook = (
    params?: Partial<Omit<Params, 'space'>> & { space?: Partial<Params['space']> },
  ) => {
    const { space, ...rest } = params ?? {}

    return renderHook(() =>
      usePlanet({
        planet,
        openingPlanetId: null,
        openPlanet,
        showError,
        ...rest,
        space: {
          trail: makeTrail(false),
          currentItem: null,
          refreshTrail,
          ...space,
        },
      }),
    )
  }

  beforeEach(() => {
    openPlanet = jest.fn().mockResolvedValue(undefined)
    refreshTrail = jest.fn().mockResolvedValue(undefined)
    showError = jest.fn()
  })

  it('should open the liberated planet, reload the user and flag it as just opened', async () => {
    const { result } = Hook()

    await act(async () => {
      await result.current.handleOpen()
    })

    expect(openPlanet).toHaveBeenCalledTimes(1)
    expect(openPlanet).toHaveBeenCalledWith(planet.id.value)
    expect(refreshTrail).toHaveBeenCalledTimes(1)
    expect(result.current.view.isJustOpened).toBe(true)
    expect(showError).not.toHaveBeenCalled()
  })

  it('should show an error and keep the planet liberated when opening fails', async () => {
    openPlanet.mockRejectedValue(new Error('failed'))
    const { result } = Hook()

    await act(async () => {
      await result.current.handleOpen()
    })

    expect(showError).toHaveBeenCalledWith(
      'Não foi possível abrir Aurora. Tente de novo.',
    )
    expect(refreshTrail).not.toHaveBeenCalled()
    expect(result.current.view.isJustOpened).toBe(false)
    expect(result.current.view.isOpenable).toBe(true)
  })

  it('should ignore the action while a planet is being opened', async () => {
    const { result } = Hook({ openingPlanetId: planet.id.value })

    await act(async () => {
      await result.current.handleOpen()
    })

    expect(result.current.view.isOpening).toBe(true)
    expect(openPlanet).not.toHaveBeenCalled()
  })

  it('should not be openable nor open an already opened planet', async () => {
    const { result } = Hook({ space: { trail: makeTrail(true) } })

    await act(async () => {
      await result.current.handleOpen()
    })

    expect(result.current.view.state).toBe('opened')
    expect(result.current.view.isOpenable).toBe(false)
    expect(openPlanet).not.toHaveBeenCalled()
  })

  it('should not be openable when the planet is locked', async () => {
    const lockedPlanet = Planet.create(PlanetsFaker.fakeDto({ position: 2 }))
    const trail = GalaxyTrail.create({
      planets: [planet, lockedPlanet],
      completedStarsIds: IdsList.create([]),
      openedPlanetsIds: IdsList.create([]),
    })
    const { result } = Hook({ planet: lockedPlanet, space: { trail } })

    await act(async () => {
      await result.current.handleOpen()
    })

    expect(result.current.view.state).toBe('locked')
    expect(openPlanet).not.toHaveBeenCalled()
  })

  it('should expose the progress, the concept and the current item flag', () => {
    const { result } = Hook({
      space: {
        currentItem: { kind: 'planet', planetId: Id.create(planet.id.value) },
      },
    })

    expect(result.current.view).toEqual(
      expect.objectContaining({
        name: 'Aurora',
        isCurrent: true,
        isAnimated: true,
        completedStarsCount: 0,
        starsCount: planet.stars.length,
      }),
    )
  })

  it('should animate the planet that holds the current star but not the other ones', () => {
    const { result } = Hook({
      space: {
        currentItem: { kind: 'star', starId: Id.create(planet.stars[0].id.value) },
      },
    })
    const other = Hook({
      space: {
        currentItem: {
          kind: 'star',
          starId: Id.create(PlanetsFaker.fake().stars[0].id.value),
        },
      },
    })

    expect(result.current.view.isAnimated).toBe(true)
    expect(result.current.view.isCurrent).toBe(false)
    expect(other.result.current.view.isAnimated).toBe(false)
  })

  it('should not animate any planet when there is no current item', () => {
    const { result } = Hook()

    expect(result.current.view.isAnimated).toBe(false)
  })
})
