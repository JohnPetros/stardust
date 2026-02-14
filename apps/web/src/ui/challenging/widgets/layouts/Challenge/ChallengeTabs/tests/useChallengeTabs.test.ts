import { act, renderHook } from '@testing-library/react'

import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'
import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { ROUTES } from '@/constants'

jest.mock('@/ui/challenging/stores/ChallengeStore', () => ({
  useChallengeStore: jest.fn(),
}))
jest.mock('@/ui/auth/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useNavigationProvider', () => ({
  useNavigationProvider: jest.fn(),
}))
jest.mock('@/ui/global/contexts/ToastContext', () => ({
  useToastContext: jest.fn(),
}))

const { useChallengeTabs } = require('../useChallengeTabs')
const { useChallengeStore } = require('@/ui/challenging/stores/ChallengeStore')
const { useAuthContext } = require('@/ui/auth/contexts/AuthContext')
const { useNavigationProvider } = require('@/ui/global/hooks/useNavigationProvider')
const { useToastContext } = require('@/ui/global/contexts/ToastContext')

describe('useChallengeTabs', () => {
  const activeContent = 'description'
  const challenge = ChallengesFaker.fake()
  const craftsVislibility = ChallengeCraftsVisibility.create({
    canShowComments: true,
    canShowSolutions: false,
  })

  const setCraftsVislibility = jest.fn()
  const updateUser = jest.fn()
  const goTo = jest.fn()
  const show = jest.fn()

  const setupStore = (overrides?: {
    challenge?: typeof challenge | null
    craftsVislibility?: typeof craftsVislibility | null
  }) => {
    jest.mocked(useChallengeStore).mockReturnValue({
      getChallengeSlice: () => ({
        challenge: overrides?.challenge ?? challenge,
        setChallenge: jest.fn(),
      }),
      getCraftsVisibilitySlice: () => ({
        craftsVislibility: overrides?.craftsVislibility ?? craftsVislibility,
        setCraftsVislibility,
      }),
      getActiveContentSlice: () => ({
        activeContent,
        setActiveContent: jest.fn(),
      }),
    } as unknown as ReturnType<typeof useChallengeStore>)
  }

  const setupAuth = (userOverride?: ReturnType<typeof UsersFaker.fake> | null) => {
    const handleSignIn = jest.fn()
    const handleSignOut = jest.fn()
    const handleSignUpWithSocialAccount = jest.fn()
    const updateUserCache = jest.fn()
    const refetchUser = jest.fn()
    const notifyUserChanges = jest.fn()

    const user =
      userOverride === undefined ? UsersFaker.fake({ coins: 20 }) : userOverride

    jest.mocked(useAuthContext).mockReturnValue({
      account: null,
      user,
      accessToken: null,
      isLoading: false,
      isAccountAuthenticated: true,
      handleSignIn,
      handleSignOut,
      handleSignUpWithSocialAccount,
      updateUser,
      updateUserCache,
      refetchUser,
      notifyUserChanges,
    } as ReturnType<typeof useAuthContext>)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    setupStore()
    setupAuth()
    jest.mocked(useNavigationProvider).mockReturnValue({
      goTo,
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
      currentRoute: '/challenge',
    } as ReturnType<typeof useNavigationProvider>)
    jest.mocked(useToastContext).mockReturnValue({
      show,
      showSuccess: jest.fn(),
      showError: jest.fn(),
    } as ReturnType<typeof useToastContext>)
  })

  it('should expose active content from store', () => {
    const { result } = renderHook(() => useChallengeTabs())

    expect(result.current.activeContent).toBe(activeContent)
  })

  it('should do nothing when required data is missing', async () => {
    setupAuth(null)
    setupStore({ challenge: null })

    const { result } = renderHook(() => useChallengeTabs())

    await act(async () => {
      await result.current.handleShowSolutions()
    })

    expect(updateUser).not.toHaveBeenCalled()
    expect(setCraftsVislibility).not.toHaveBeenCalled()
    expect(goTo).not.toHaveBeenCalled()
    expect(show).not.toHaveBeenCalled()
  })

  it('should show toast when user cannot afford solutions', async () => {
    setupAuth(UsersFaker.fake({ coins: 0 }))

    const { result } = renderHook(() => useChallengeTabs())

    await act(async () => {
      await result.current.handleShowSolutions()
    })

    expect(show).toHaveBeenCalledWith('Você não possui moedas suficiente')
    expect(updateUser).not.toHaveBeenCalled()
    expect(setCraftsVislibility).not.toHaveBeenCalled()
    expect(goTo).not.toHaveBeenCalled()
  })

  it('should update user, visibility, and navigate when user can afford', async () => {
    const { result } = renderHook(() => useChallengeTabs())

    await act(async () => {
      await result.current.handleShowSolutions()
    })

    expect(updateUser).toHaveBeenCalledWith(expect.any(Object))
    expect(setCraftsVislibility).toHaveBeenCalledWith(
      expect.objectContaining({
        canShowSolutions: expect.objectContaining({ isTrue: true }),
      }),
    )
    expect(goTo).toHaveBeenCalledWith(
      ROUTES.challenging.challenges.challengeSolutions.list(challenge.slug.value),
    )
  })
})
