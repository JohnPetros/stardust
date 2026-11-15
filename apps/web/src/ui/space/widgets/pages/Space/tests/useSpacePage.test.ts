import { renderHook } from '@testing-library/react'

import { type Params, useSpacePage } from '../useSpacePage'

describe('useSpacePage', () => {
  let scrollIntoLastUnlockedStar: jest.Mock

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useSpacePage({
        lastUnlockedStarPosition: 'in',
        scrollIntoLastUnlockedStar,
        hasCompletedSpace: false,
        isFirstGalaxy: true,
        ...params,
      }),
    )

  beforeEach(() => {
    scrollIntoLastUnlockedStar = jest.fn()
  })

  it.each([
    { hasCompletedSpace: true, isFirstGalaxy: true, expected: true },
    { hasCompletedSpace: true, isFirstGalaxy: false, expected: false },
    { hasCompletedSpace: false, isFirstGalaxy: true, expected: false },
    { hasCompletedSpace: false, isFirstGalaxy: false, expected: false },
  ])(
    'should return $expected as shouldShowEnding when hasCompletedSpace is $hasCompletedSpace and isFirstGalaxy is $isFirstGalaxy',
    ({ hasCompletedSpace, isFirstGalaxy, expected }) => {
      const { result } = Hook({ hasCompletedSpace, isFirstGalaxy })

      expect(result.current.shouldShowEnding).toBe(expected)
    },
  )

  it('should scroll into the last unlocked star when the fab is clicked', () => {
    const { result } = Hook()

    result.current.handleFabClick()

    expect(scrollIntoLastUnlockedStar).toHaveBeenCalledTimes(1)
  })

  it('should return the last unlocked star position received', () => {
    const { result } = Hook({ lastUnlockedStarPosition: 'above' })

    expect(result.current.lastUnlockedStarPosition).toBe('above')
  })
})
