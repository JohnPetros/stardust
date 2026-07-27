import { renderHook, waitFor } from '@testing-library/react'

import { Challenge } from '@stardust/core/challenging/entities'
import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { CodePlaybacksFaker } from '@stardust/core/global/structures/fakers'
import { ChallengeVote } from '@stardust/core/challenging/structures'
import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

import { useChallengePage } from '../useChallengePage'

const setActiveContent = jest.fn()
const setChallenge = jest.fn()
const setCraftsVislibility = jest.fn()
const resetStore = jest.fn()
const goTo = jest.fn()
let mockCurrentRoute = '/challenging/challenges/example/challenge/solutions/official'
let mockChallenge: Challenge | null = null

jest.mock('@/ui/challenging/stores/ChallengeStore', () => ({
  useChallengeStore: jest.fn(() => ({
    getChallengeSlice: () => ({
      challenge: mockChallenge,
      setChallenge,
    }),
    getCraftsVisibilitySlice: () => ({
      craftsVislibility: null,
      setCraftsVislibility,
    }),
    getActiveContentSlice: () => ({
      setActiveContent,
    }),
    getPanelOrderSlice: () => ({
      panelOrder: [],
    }),
    resetPanelsLayout: jest.fn(),
    resetStore,
  })),
}))

jest.mock('@/ui/global/hooks/useNavigationProvider', () => ({
  useNavigationProvider: jest.fn(() => ({
    currentRoute: mockCurrentRoute,
    goTo,
  })),
}))

jest.mock('@/ui/global/hooks/useQueryStringParam', () => ({
  useQueryStringParam: jest.fn(() => [null]),
}))

jest.mock('@/ui/global/hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(() => ({
    remove: jest.fn(),
    get: jest.fn(),
  })),
}))

jest.mock('@/ui/challenging/hooks/useChallengeNavigationGuard', () => ({
  useChallengeNavigationGuard: jest.fn(() => ({
    requestNavigation: jest.fn(),
    confirmNavigation: jest.fn(),
    cancelNavigation: jest.fn(),
  })),
}))

describe('useChallengePage', () => {
  const challengeDto = ChallengesFaker.fakeDto({
    slug: 'example',
    officialSolution: null,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockCurrentRoute = '/challenging/challenges/example/challenge/solutions/official'
    mockChallenge = null
  })

  it('hydrates again when only officialSolution changes', () => {
    mockChallenge = null
    const { rerender } = renderHook(
      ({ officialSolution }: { officialSolution: ChallengeDto['officialSolution'] }) =>
        useChallengePage({
          challengeDto: { ...challengeDto, officialSolution },
          userChallengeVote: 'none',
          previousChallengeSlug: null,
          nextChallengeSlug: null,
          user: null,
          isAccountAuthenticated: false,
        }),
      {
        initialProps: {
          officialSolution: null as ChallengeDto['officialSolution'],
        },
      },
    )

    expect(setChallenge).toHaveBeenCalledTimes(1)

    rerender({ officialSolution: CodePlaybacksFaker.fakeDto() })

    expect(setChallenge).toHaveBeenCalledTimes(2)
  })

  it('keeps the solutions tab active for the official and user solution URLs', () => {
    mockChallenge = Challenge.create(challengeDto)

    const { rerender } = renderHook(() =>
      useChallengePage({
        challengeDto,
        userChallengeVote: 'none',
        previousChallengeSlug: null,
        nextChallengeSlug: null,
        user: null,
        isAccountAuthenticated: false,
      }),
    )

    expect(setActiveContent).toHaveBeenCalledWith('solutions')

    mockCurrentRoute = '/challenging/challenges/example/challenge/solutions/my-solution'
    rerender()

    expect(setActiveContent).toHaveBeenCalledWith('solutions')
  })

  it('rehydrates challenge store when payload is stale, including same slug updates', async () => {
    const staleChallenge = Challenge.create({
      ...challengeDto,
      description: 'Stale description',
      initialCode: 'function sum() { return 0 }',
    })
    staleChallenge.userVote = ChallengeVote.create('none')
    mockChallenge = staleChallenge

    renderHook(() =>
      useChallengePage({
        challengeDto,
        userChallengeVote: 'upvote',
        previousChallengeSlug: null,
        nextChallengeSlug: null,
        user: null,
        isAccountAuthenticated: false,
      }),
    )

    await waitFor(() => expect(setChallenge).toHaveBeenCalledTimes(1))

    const hydratedChallenge = setChallenge.mock.calls[0][0] as Challenge

    expect(hydratedChallenge.description.value).toBe(challengeDto.description)
    expect(hydratedChallenge.initialCode.value).toBe(challengeDto.initialCode)
    expect(hydratedChallenge.userVote.value).toBe('upvote')
  })

  it('preserves client-side challenge state when payload is stable', () => {
    const stableChallenge = Challenge.create(challengeDto)
    stableChallenge.userVote = ChallengeVote.create('upvote')
    mockChallenge = stableChallenge

    renderHook(() =>
      useChallengePage({
        challengeDto,
        userChallengeVote: 'upvote',
        previousChallengeSlug: null,
        nextChallengeSlug: null,
        user: null,
        isAccountAuthenticated: false,
      }),
    )

    expect(setChallenge).not.toHaveBeenCalled()
  })
})
