import { renderHook } from '@testing-library/react'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { CodePlaybacksFaker } from '@stardust/core/global/structures/fakers'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

jest.mock('@/ui/global/hooks/usePaginatedCache', () => ({
  usePaginatedCache: jest.fn(),
}))

import { useChallengeSolutionsSlot } from '../useChallengeSolutionsSlot'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'

const mockUsePaginatedCache = jest.mocked(usePaginatedCache)

describe('useChallengeSolutionsSlot', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePaginatedCache.mockReturnValue({
      data: [],
      isLoading: false,
      isRefetching: false,
      isReachedEnd: true,
      totalItemsCount: 0,
      page: 1,
      refetch: jest.fn(),
      nextPage: jest.fn(),
      setPage: jest.fn(),
    })
  })

  it('keeps integrations outside the hook and exposes the official playback snapshot', () => {
    const officialSolution = CodePlaybacksFaker.fakeDto()
    const challenge = ChallengesFaker.fake({ officialSolution })
    const user = UsersFaker.fake()

    const { result } = renderHook(() =>
      useChallengeSolutionsSlot({
        challengingService: {} as ChallengingService,
        user,
        challenge,
      }),
    )

    expect(result.current.officialSolution).toEqual(officialSolution)
    expect(mockUsePaginatedCache).toHaveBeenCalledWith(
      expect.objectContaining({ isEnabled: true }),
    )
  })
})
