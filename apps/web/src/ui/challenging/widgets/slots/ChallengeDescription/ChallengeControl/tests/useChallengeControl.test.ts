import { act, renderHook } from '@testing-library/react'
import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { ActionResponse, RestResponse } from '@stardust/core/global/responses'

import { ROUTES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'

import { useChallengeControl } from '../useChallengeControl'

jest.mock('@/ui/challenging/stores/ChallengeStore', () => ({
  useChallengeStore: jest.fn(),
}))
jest.mock('@/ui/global/contexts/ToastContext', () => ({
  useToastContext: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useNavigationProvider', () => ({
  useNavigationProvider: jest.fn(),
}))

describe('useChallengeControl', () => {
  const setChallenge = jest.fn()
  const show = jest.fn()
  const goTo = jest.fn()

  let challengingService: Mock<ChallengingService>
  let challenge = ChallengesFaker.fake({ isPublic: false })

  const setupStore = () => {
    jest.mocked(useChallengeStore).mockReturnValue({
      getChallengeSlice: () => ({ challenge, setChallenge }),
    } as unknown as ReturnType<typeof useChallengeStore>)
  }

  const Hook = (
    onUpdateChallengeVisibility = jest.fn(),
    isChallengePublic = false,
    isManagingAsAdmin = false,
  ) =>
    renderHook(() =>
      useChallengeControl(
        challengingService,
        onUpdateChallengeVisibility,
        isChallengePublic,
        isManagingAsAdmin,
      ),
    )

  beforeEach(() => {
    jest.clearAllMocks()

    challengingService = mock<ChallengingService>()
    challenge = ChallengesFaker.fake({ isPublic: false })

    setupStore()
    jest.mocked(useToastContext).mockReturnValue({
      show,
      showSuccess: jest.fn(),
      showError: jest.fn(),
    } as ReturnType<typeof useToastContext>)
    jest.mocked(useNavigationProvider).mockReturnValue({
      goTo,
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
      currentRoute: '/challenge',
    } as ReturnType<typeof useNavigationProvider>)
  })

  it('should update visibility optimistically, persist it and set the challenge on success', async () => {
    const onUpdateChallengeVisibility = jest
      .fn()
      .mockResolvedValue(new ActionResponse({ data: { isPublic: true } }))

    const { result } = Hook(onUpdateChallengeVisibility)

    await act(async () => {
      await result.current.handleIsChallengePublicSwitchChange(true)
    })

    expect(onUpdateChallengeVisibility).toHaveBeenCalledWith(challenge.id.value, true)
    expect(result.current.isPublic).toBe(true)
    expect(challenge.isPublic.isTrue).toBe(true)
    expect(setChallenge).toHaveBeenCalledWith(challenge)
  })

  it('should rollback local visibility and show toast when persistence fails', async () => {
    const onUpdateChallengeVisibility = jest
      .fn()
      .mockResolvedValue(
        new ActionResponse({ errorMessage: 'Failed to update challenge visibility' }),
      )

    const { result } = Hook(onUpdateChallengeVisibility)

    await act(async () => {
      await result.current.handleIsChallengePublicSwitchChange(true)
    })

    expect(result.current.isPublic).toBe(false)
    expect(challenge.isPublic.isFalse).toBe(true)
    expect(show).toHaveBeenCalledWith('Failed to update challenge visibility')
    expect(setChallenge).not.toHaveBeenCalled()
  })

  it('should navigate after deleting the challenge successfully', async () => {
    challengingService.deleteChallenge.mockResolvedValue(new RestResponse())

    const { result } = Hook()

    await act(async () => {
      await result.current.handleDeleteChallengeButtonClick()
    })

    expect(challengingService.deleteChallenge).toHaveBeenCalledWith(challenge)
    expect(goTo).toHaveBeenCalledWith(ROUTES.challenging.challenges.list)
  })

  it('should show toast and keep the user on the page when deletion fails', async () => {
    challengingService.deleteChallenge.mockResolvedValue(
      new RestResponse({
        statusCode: 500,
        errorMessage: 'Failed to delete challenge',
      }),
    )

    const { result } = Hook()

    await act(async () => {
      await result.current.handleDeleteChallengeButtonClick()
    })

    expect(show).toHaveBeenCalledWith('Failed to delete challenge')
    expect(goTo).not.toHaveBeenCalled()
  })
})
