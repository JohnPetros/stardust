import { renderHook, waitFor } from '@testing-library/react'

import { Challenge } from '@stardust/core/challenging/entities'
import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import {
  ChallengeCraftsVisibility,
  ChallengeVote,
} from '@stardust/core/challenging/structures'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useChallengeNavigationGuard } from '@/ui/challenging/hooks/useChallengeNavigationGuard'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useChallengePage } from '../useChallengePage'

jest.mock('@/ui/challenging/stores/ChallengeStore', () => ({
  useChallengeStore: jest.fn(),
}))
jest.mock('@/ui/challenging/hooks/useChallengeNavigationGuard', () => ({
  useChallengeNavigationGuard: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useNavigationProvider', () => ({
  useNavigationProvider: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useQueryStringParam', () => ({
  useQueryStringParam: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}))

type Params = Parameters<typeof useChallengePage>[0]

describe('useChallengePage', () => {
  const setChallenge = jest.fn()
  const setPanelsLayout = jest.fn()
  const setActiveContent = jest.fn()
  const setCraftsVislibility = jest.fn()
  const resetStore = jest.fn()
  const goTo = jest.fn()
  const requestNavigation = jest.fn()
  const confirmNavigation = jest.fn()
  const cancelNavigation = jest.fn()
  const removeLocalStorageItem = jest.fn()

  const craftsVislibility = ChallengeCraftsVisibility.create({
    canShowComments: true,
    canShowSolutions: false,
  })

  const challengeDto = ChallengesFaker.fakeDto({
    id: 'c07445ed-ee93-48dc-a84f-7d4f5e2f6f4d',
    title: 'Find Sum',
    slug: 'find-sum',
    description: 'Current challenge description',
    code: 'function sum(a, b) { return a + b }',
    difficultyLevel: 'easy',
    categories: [],
  })

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useChallengePage({
        challengeDto,
        userChallengeVote: 'upvote',
        previousChallengeSlug: null,
        nextChallengeSlug: null,
        user: null,
        isAccountAuthenticated: false,
        ...params,
      }),
    )

  function setupStore(challenge: Challenge | null) {
    jest.mocked(useChallengeStore).mockReturnValue({
      getChallengeSlice: () => ({
        challenge,
        setChallenge,
      }),
      getCraftsVisibilitySlice: () => ({
        craftsVislibility,
        setCraftsVislibility,
      }),
      getActiveContentSlice: () => ({
        activeContent: 'description',
        setActiveContent,
      }),
      getPanelsLayoutSlice: () => ({
        panelsLayout: 'tabs-left;code_editor-right',
        setPanelsLayout,
      }),
      resetStore,
    } as unknown as ReturnType<typeof useChallengeStore>)
  }

  beforeEach(() => {
    jest.clearAllMocks()

    setupStore(null)

    jest.mocked(useNavigationProvider).mockReturnValue({
      goTo,
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
      currentRoute: '/challenging/challenges/find-sum',
    } as ReturnType<typeof useNavigationProvider>)

    jest.mocked(useQueryStringParam).mockReturnValue(['', jest.fn()])

    jest.mocked(useLocalStorage).mockReturnValue({
      get: jest.fn(),
      set: jest.fn(),
      has: jest.fn(),
      remove: removeLocalStorageItem,
    } as ReturnType<typeof useLocalStorage>)

    jest.mocked(useChallengeNavigationGuard).mockReturnValue({
      requestNavigation,
      confirmNavigation,
      cancelNavigation,
      isDirty: jest.fn().mockReturnValue(false),
    })
  })

  it('should rehydrate challenge store when payload is stale, including same slug updates', async () => {
    const staleChallenge = Challenge.create({
      ...challengeDto,
      description: 'Stale description',
      code: 'function sum() { return 0 }',
    })
    staleChallenge.userVote = ChallengeVote.create('none')
    setupStore(staleChallenge)

    Hook()

    await waitFor(() => expect(setChallenge).toHaveBeenCalledTimes(1))

    const hydratedChallenge = setChallenge.mock.calls[0][0] as Challenge

    expect(hydratedChallenge.description.value).toBe(challengeDto.description)
    expect(hydratedChallenge.code).toBe(challengeDto.code)
    expect(hydratedChallenge.userVote.value).toBe('upvote')
  })

  it('should preserve client-side challenge state when payload is stable', () => {
    const stableChallenge = Challenge.create(challengeDto)
    stableChallenge.userVote = ChallengeVote.create('upvote')
    setupStore(stableChallenge)

    Hook()

    expect(setChallenge).not.toHaveBeenCalled()
  })
})
