import { act, renderHook } from '@testing-library/react'

import { Id, IdsList } from '@stardust/core/global/structures'
import { Planet } from '@stardust/core/space/entities'
import { PlanetsFaker, StarsFaker } from '@stardust/core/space/entities/fakers'
import { GalaxyTrail } from '@stardust/core/space/structures'

import { type Params, useStar } from '../useStar'

describe('useStar', () => {
  const firstStar = StarsFaker.fakeDto({ number: 1 })
  const secondStar = StarsFaker.fakeDto({ number: 2 })
  const planet = Planet.create(
    PlanetsFaker.fakeDto({ position: 1, stars: [firstStar, secondStar] }),
  )

  let selectStar: jest.Mock
  let openStarDetails: jest.Mock
  let unregister: jest.Mock
  let registerStarAnimation: jest.Mock

  function makeTrail(facts: { completed?: string[]; opened?: boolean }) {
    return GalaxyTrail.create({
      planets: [planet],
      completedStarsIds: IdsList.create(facts.completed ?? []),
      openedPlanetsIds: IdsList.create(facts.opened === false ? [] : [planet.id.value]),
    })
  }

  const Hook = (
    params?: Partial<Omit<Params, 'space'>> & { space?: Partial<Params['space']> },
  ) => {
    const { space, ...rest } = params ?? {}

    return renderHook(() =>
      useStar({
        starId: Id.create(firstStar.id as string),
        planetId: planet.id,
        isChallenge: false,
        previousStarNumber: null,
        ...rest,
        space: {
          trail: makeTrail({}),
          currentItem: null,
          selectedStarId: null,
          selectStar,
          openStarDetails,
          registerStarAnimation,
          ...space,
        },
      }),
    )
  }

  beforeEach(() => {
    selectStar = jest.fn()
    openStarDetails = jest.fn()
    unregister = jest.fn()
    registerStarAnimation = jest.fn().mockReturnValue(unregister)
  })

  it('should select an accessible star on hover or focus without opening the details', () => {
    const { result } = Hook()

    act(() => {
      result.current.handleSelect()
    })

    expect(selectStar).toHaveBeenCalledWith(firstStar.id)
    expect(openStarDetails).not.toHaveBeenCalled()
  })

  it('should select and open the details on click', () => {
    const { result } = Hook({
      space: { trail: makeTrail({ completed: [firstStar.id as string] }) },
    })

    act(() => {
      result.current.handleClick()
    })

    expect(selectStar).toHaveBeenCalledWith(firstStar.id)
    expect(openStarDetails).toHaveBeenCalledTimes(1)
  })

  it('should not select a locked star', () => {
    const { result } = Hook({
      starId: Id.create(secondStar.id as string),
      previousStarNumber: 1,
    })

    act(() => {
      result.current.handleSelect()
      result.current.handleClick()
    })

    expect(result.current.view.isAccessible).toBe(false)
    expect(selectStar).not.toHaveBeenCalled()
    expect(openStarDetails).not.toHaveBeenCalled()
  })

  it('should flag the selected star and the current star', () => {
    const { result } = Hook({
      space: {
        selectedStarId: firstStar.id as string,
        currentItem: { kind: 'star', starId: Id.create(firstStar.id as string) },
      },
    })

    expect(result.current.view.isSelected).toBe(true)
    expect(result.current.view.isCurrent).toBe(true)
  })

  it('should report when there is no trail', () => {
    const { result } = Hook({ space: { trail: null } })

    expect(result.current.hasTrail).toBe(false)
    expect(result.current.view.state).toBe('locked')
  })

  it('should register the animation and unregister it on unmount', () => {
    const { result, unmount } = Hook()

    expect(registerStarAnimation).toHaveBeenCalledWith(
      firstStar.id,
      result.current.view.starAnimationRef,
    )

    unmount()

    expect(unregister).toHaveBeenCalledTimes(1)
  })

  it('should describe the type and the state of the star', () => {
    const challenge = Hook({
      isChallenge: true,
      space: { trail: makeTrail({ completed: [firstStar.id as string] }) },
    })
    const story = Hook()

    expect(challenge.result.current.view).toEqual(
      expect.objectContaining({
        typeLabel: 'Desafio de código',
        stateLabel: 'Concluída',
        unlockHint: null,
      }),
    )
    expect(story.result.current.view).toEqual(
      expect.objectContaining({ typeLabel: 'História', stateLabel: 'Disponível' }),
    )
  })

  it('should tell to open the planet when a star of a not opened planet is locked', () => {
    const { result } = Hook({ space: { trail: makeTrail({ opened: false }) } })

    expect(result.current.view.unlockHint).toBe('Abra o planeta para liberar')
  })

  it('should tell to complete the previous star when a star of an opened planet is locked', () => {
    const { result } = Hook({
      starId: Id.create(secondStar.id as string),
      previousStarNumber: 1,
    })

    expect(result.current.view.unlockHint).toBe('Conclua a estrela 1 para liberar')
  })
})
