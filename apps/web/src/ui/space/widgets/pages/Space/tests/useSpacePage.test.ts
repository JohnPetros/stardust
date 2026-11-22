import { act, renderHook } from '@testing-library/react'

import { PlanetsFaker } from '@stardust/core/space/entities/fakers'
import { Planet } from '@stardust/core/space/entities'
import { Id, IdsList } from '@stardust/core/global/structures'
import { GalaxyTrail } from '@stardust/core/space/structures'

import { type Params, useSpacePage } from '../useSpacePage'

describe('useSpacePage', () => {
  const planets = [Planet.create(PlanetsFaker.fakeDto())]
  const trail = GalaxyTrail.create({
    planets,
    completedStarsIds: IdsList.create([]),
    openedPlanetsIds: IdsList.create([]),
  })
  let scrollToCurrentItem: jest.Mock
  let closeStarDetails: jest.Mock

  type Overrides = Partial<Omit<Params, 'space'>> & { space?: Partial<Params['space']> }

  const Hook = ({ space, ...params }: Overrides = {}) =>
    renderHook(() =>
      useSpacePage({
        isFirstGalaxy: true,
        hasCompletedSpace: false,
        isMobile: false,
        ...params,
        space: {
          planets,
          galaxy: { id: 'galaxy-id', slug: 'logica', name: 'Lógica' },
          hasGalaxyChoice: true,
          trail,
          currentItem: { kind: 'planet', planetId: Id.create(planets[0].id.value) },
          currentItemPosition: 'in',
          scrollToCurrentItem,
          isStarDetailsOpen: false,
          selectedStarId: 'star-id',
          closeStarDetails,
          ...space,
        },
      }),
    )

  beforeEach(() => {
    jest.useFakeTimers()
    document.body.innerHTML = ''
    scrollToCurrentItem = jest.fn()
    closeStarDetails = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should be loading without a trail and empty without planets', () => {
    expect(Hook({ space: { trail: null } }).result.current.view.status).toBe('loading')
    expect(Hook({ space: { planets: [] } }).result.current.view.status).toBe('empty')
    expect(Hook().result.current.view.status).toBe('ready')
  })

  it.each(['above', 'below'] as const)(
    'should show the fab when the current item is %s the visible area',
    (currentItemPosition) => {
      const { result } = Hook({ space: { currentItemPosition } })

      expect(result.current.view.isFabVisible).toBe(true)
    },
  )

  it('should hide the fab when the current item is visible', () => {
    expect(Hook().result.current.view.isFabVisible).toBe(false)
  })

  it('should never show the fab without a current item or in an empty trail', () => {
    const withoutItem = Hook({
      space: { currentItem: null, currentItemPosition: 'above' },
    })
    const emptyTrail = Hook({ space: { planets: [], currentItemPosition: 'above' } })

    expect(withoutItem.result.current.view.isFabVisible).toBe(false)
    expect(emptyTrail.result.current.view.isFabVisible).toBe(false)
  })

  it('should hide the fab while the bottom sheet is open', () => {
    const { result } = Hook({
      isMobile: true,
      space: { isStarDetailsOpen: true, currentItemPosition: 'above' },
    })

    expect(result.current.view.isSheetOpen).toBe(true)
    expect(result.current.view.isFabVisible).toBe(false)
  })

  it('should not open the sheet on desktop', () => {
    const { result } = Hook({ isMobile: false, space: { isStarDetailsOpen: true } })

    expect(result.current.view.isSheetOpen).toBe(false)
  })

  it('should scroll to the current item when the fab is clicked', () => {
    const { result } = Hook({ space: { currentItemPosition: 'above' } })

    act(() => {
      result.current.handleFabClick()
    })

    expect(scrollToCurrentItem).toHaveBeenCalledTimes(1)
  })

  it('should close the details and return the focus to the star', () => {
    const star = document.createElement('button')
    star.id = 'star-star-id'
    document.body.appendChild(star)
    const { result } = Hook({ isMobile: true, space: { isStarDetailsOpen: true } })

    act(() => {
      result.current.handleSheetClose()
      jest.runAllTimers()
    })

    expect(closeStarDetails).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(star)
  })

  it('should show the ending only when the space was completed in the first galaxy', () => {
    const completed = Hook({ hasCompletedSpace: true, isFirstGalaxy: true })
    const otherGalaxy = Hook({ hasCompletedSpace: true, isFirstGalaxy: false })
    const notCompleted = Hook({ hasCompletedSpace: false, isFirstGalaxy: true })

    expect(completed.result.current.view.shouldShowEnding).toBe(true)
    expect(otherGalaxy.result.current.view.shouldShowEnding).toBe(false)
    expect(notCompleted.result.current.view.shouldShowEnding).toBe(false)
  })
})
