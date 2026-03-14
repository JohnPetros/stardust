import { act, renderHook, waitFor } from '@testing-library/react'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'
import { List } from '@stardust/core/global/structures'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { COOKIES, ROUTES } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useCookieActions } from '@/ui/global/hooks/useCookieActions'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'

import { useChallengeResultSlot } from '../useChallengeResultSlot'

jest.mock('@/ui/auth/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(),
}))
jest.mock('@/ui/challenging/stores/ChallengeStore', () => ({
  useChallengeStore: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useBreakpoint', () => ({
  useBreakpoint: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useCookieActions', () => ({
  useCookieActions: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useNavigationProvider', () => ({
  useNavigationProvider: jest.fn(),
}))

describe('useChallengeResultSlot', () => {
  const setChallenge = jest.fn()
  const setCraftsVislibility = jest.fn()
  const showCodeTab = jest.fn()
  const setCookie = jest.fn()
  const localStorageGet = jest.fn()
  const localStorageRemove = jest.fn()
  const goTo = jest.fn()
  const openAlertDialog = jest.fn()

  let challenge = ChallengesFaker.fake()
  let user = UsersFaker.fake()
  let craftsVislibility = ChallengeCraftsVisibility.create({
    canShowComments: false,
    canShowSolutions: false,
  })
  let currentRoute = '/challenge'

  const alertDialogRef = {
    current: {
      open: openAlertDialog,
      close: jest.fn(),
    },
  }

  const setupStore = () => {
    jest.mocked(useChallengeStore).mockReturnValue({
      getChallengeSlice: () => ({ challenge, setChallenge }),
      getCraftsVisibilitySlice: () => ({
        craftsVislibility,
        setCraftsVislibility,
      }),
      getTabHandlerSlice: () => ({
        tabHandler: {
          showCodeTab,
          showResultTab: jest.fn(),
          showAssistantTab: jest.fn(),
        },
      }),
      getResultsSlice: () => ({ results: challenge.results.items }),
    } as unknown as ReturnType<typeof useChallengeStore>)
  }

  const setupAuth = () => {
    jest.mocked(useAuthContext).mockReturnValue({
      account: null,
      user,
      accessToken: null,
      isLoading: false,
      isAccountAuthenticated: true,
      handleSignIn: jest.fn(),
      handleSignOut: jest.fn(),
      handleSignUpWithSocialAccount: jest.fn(),
      handleRetryUserCreation: jest.fn(),
      updateUser: jest.fn(),
      updateUserCache: jest.fn(),
      refetchUser: jest.fn(),
      notifyUserChanges: jest.fn(),
    } as ReturnType<typeof useAuthContext>)
  }

  const Hook = (isAccountAuthenticated = true) =>
    renderHook(() =>
      useChallengeResultSlot({
        alertDialogRef,
        isAccountAuthenticated,
      }),
    )

  const setChallengeResults = (results: boolean[], userOutputs?: unknown[]) => {
    challenge['props'].results = List.create(results)
    challenge['props'].userOutputs = List.create(
      userOutputs ?? results.map(() => 'output'),
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()

    challenge = ChallengesFaker.fake()
    user = UsersFaker.fake()
    craftsVislibility = ChallengeCraftsVisibility.create({
      canShowComments: false,
      canShowSolutions: false,
    })
    currentRoute = '/challenge'

    setupStore()
    setupAuth()

    jest.mocked(useBreakpoint).mockReturnValue({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    })
    jest.mocked(useCookieActions).mockReturnValue({
      setCookie,
      deleteCookie: jest.fn(),
      getCookie: jest.fn(),
      hasCookie: jest.fn(),
    } as unknown as ReturnType<typeof useCookieActions>)
    jest.mocked(useLocalStorage).mockReturnValue({
      get: localStorageGet,
      set: jest.fn(),
      has: jest.fn(),
      remove: localStorageRemove,
    } as unknown as ReturnType<typeof useLocalStorage>)
    jest.mocked(useNavigationProvider).mockReturnValue({
      goTo,
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
      currentRoute,
    } as ReturnType<typeof useNavigationProvider>)

    localStorageGet.mockReturnValue('42')
  })

  it('should complete the challenge and reveal crafts when all results are correct', () => {
    setChallengeResults(challenge.testCases.map(() => true))
    setupStore()

    const { result } = Hook()

    act(() => {
      result.current.handleUserAnswer()
    })

    expect(challenge.isCompleted.isTrue).toBe(true)
    expect(setChallenge).toHaveBeenCalledWith(challenge)
    expect(setCraftsVislibility).toHaveBeenCalledWith(
      expect.objectContaining({
        canShowComments: expect.objectContaining({ isTrue: true }),
        canShowSolutions: expect.objectContaining({ isTrue: true }),
      }),
    )
    expect(result.current.userAnswer.isVerified.isTrue).toBe(true)
    expect(result.current.userAnswer.isCorrect.isTrue).toBe(true)
  })

  it('should still show star challenge rewards when a star challenge is already completed by the user', async () => {
    challenge = ChallengesFaker.fake({ starId: UsersFaker.fake().id.value })
    challenge.becomeCompleted()
    user = UsersFaker.fake({ completedChallengesIds: [challenge.id.value] })
    setupStore()
    setupAuth()

    const { result } = Hook()

    act(() => {
      result.current.handleUserAnswer()
    })

    await waitFor(() => {
      expect(setCookie).toHaveBeenCalledWith({
        key: COOKIES.keys.rewardingPayload,
        value: JSON.stringify({
          secondsCount: 42,
          incorrectAnswersCount: challenge.incorrectAnswersCount.value,
          maximumIncorrectAnswersCount: challenge.maximumIncorrectAnswersCount.value,
          challengeId: challenge.id.value,
          starId: challenge.starId?.value,
        }),
      })
    })

    await waitFor(() => {
      expect(localStorageRemove).toHaveBeenCalledTimes(1)
      expect(goTo).toHaveBeenCalledWith(ROUTES.rewarding.starChallenge)
    })
  })

  it('should open the alert dialog when an unauthenticated user finishes a regular challenge', () => {
    challenge.becomeCompleted()
    setupStore()

    const { result } = Hook(false)

    act(() => {
      result.current.handleUserAnswer()
    })

    expect(openAlertDialog).toHaveBeenCalledTimes(1)
    expect(goTo).not.toHaveBeenCalled()
    expect(setCookie).not.toHaveBeenCalled()
  })

  it('should go back to the challenge list when the user already completed the challenge', () => {
    challenge.becomeCompleted()
    user = UsersFaker.fake({ completedChallengesIds: [challenge.id.value] })
    setupStore()
    setupAuth()

    const { result } = Hook()

    act(() => {
      result.current.handleUserAnswer()
    })

    expect(localStorageRemove).toHaveBeenCalledTimes(1)
    expect(goTo).toHaveBeenCalledWith(ROUTES.challenging.challenges.list)
    expect(setCookie).not.toHaveBeenCalled()
  })

  it('should store the rewarding payload and navigate to the challenge rewarding page', async () => {
    challenge.becomeCompleted()
    user = UsersFaker.fake({ completedChallengesIds: [] })
    setupStore()
    setupAuth()

    const { result } = Hook()

    act(() => {
      result.current.handleUserAnswer()
    })

    await waitFor(() => {
      expect(setCookie).toHaveBeenCalledWith({
        key: COOKIES.keys.rewardingPayload,
        value: JSON.stringify({
          secondsCount: 42,
          incorrectAnswersCount: challenge.incorrectAnswersCount.value,
          maximumIncorrectAnswersCount: challenge.maximumIncorrectAnswersCount.value,
          challengeId: challenge.id.value,
        }),
      })
    })

    await waitFor(() => {
      expect(goTo).toHaveBeenCalledWith(ROUTES.rewarding.challenge)
    })

    expect(localStorageRemove).toHaveBeenCalledTimes(1)
    expect(result.current.isLeavingPage).toBe(true)
  })

  it('should store the star rewarding payload for completed star challenges', async () => {
    challenge = ChallengesFaker.fake({ starId: UsersFaker.fake().id.value })
    challenge.becomeCompleted()
    setupStore()

    const { result } = Hook()

    act(() => {
      result.current.handleUserAnswer()
    })

    await waitFor(() => {
      expect(setCookie).toHaveBeenCalledWith({
        key: COOKIES.keys.rewardingPayload,
        value: JSON.stringify({
          secondsCount: 42,
          incorrectAnswersCount: challenge.incorrectAnswersCount.value,
          maximumIncorrectAnswersCount: challenge.maximumIncorrectAnswersCount.value,
          challengeId: challenge.id.value,
          starId: challenge.starId?.value,
        }),
      })
    })

    await waitFor(() => {
      expect(goTo).toHaveBeenCalledWith(ROUTES.rewarding.starChallenge)
    })
  })

  it('should mark the answer as correct on the result route for completed challenges', async () => {
    setChallengeResults([true, true, true], ['ok', 'ok', 'ok'])
    challenge.becomeCompleted()
    currentRoute = '/challenge/result'
    setupStore()
    jest.mocked(useNavigationProvider).mockReturnValue({
      goTo,
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
      currentRoute,
    } as ReturnType<typeof useNavigationProvider>)

    const { result } = Hook()

    await waitFor(() => {
      expect(result.current.userAnswer.isVerified.isTrue).toBe(true)
      expect(result.current.userAnswer.isCorrect.isTrue).toBe(true)
    })
  })

  it('should show the code tab on mobile when the answer is incorrect', () => {
    const incorrectAnswer = {
      isCorrect: { isTrue: false, isFalse: true },
      isVerified: { isTrue: false, isFalse: true },
    }

    challenge.verifyUserAnswer = jest.fn(() => incorrectAnswer) as never
    setupStore()
    jest.mocked(useBreakpoint).mockReturnValue({
      xs: false,
      sm: false,
      md: true,
      lg: false,
      xl: false,
    })

    const { result } = Hook()

    act(() => {
      result.current.handleUserAnswer()
    })

    expect(showCodeTab).toHaveBeenCalledTimes(1)
    expect(challenge.verifyUserAnswer).toHaveBeenCalled()
    expect(result.current.userAnswer).toBe(incorrectAnswer)
  })
})
