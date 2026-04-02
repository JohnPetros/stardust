import { act, renderHook } from '@testing-library/react'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { ActionResponse } from '@stardust/core/global/responses'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

import { useChallengeVoteControl } from '../useChallengeVoteControl'

jest.mock('@/ui/auth/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(),
}))
jest.mock('@/ui/challenging/stores/ChallengeStore', () => ({
  useChallengeStore: jest.fn(),
}))
jest.mock('@/ui/global/contexts/ToastContext', () => ({
  useToastContext: jest.fn(),
}))

describe('useChallengeVoteControl', () => {
  const setChallenge = jest.fn()
  const showError = jest.fn()

  let challenge = ChallengesFaker.fake({
    upvotesCount: 1,
    downvotesCount: 0,
  })
  let user = UsersFaker.fake()

  const setupStore = () => {
    jest.mocked(useChallengeStore).mockReturnValue({
      getChallengeSlice: () => ({ challenge, setChallenge }),
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

  const Hook = (onVoteChallenge = jest.fn()) =>
    renderHook(() => useChallengeVoteControl(onVoteChallenge))

  beforeEach(() => {
    jest.clearAllMocks()

    user = UsersFaker.fake()
    challenge = ChallengesFaker.fake({
      upvotesCount: 1,
      downvotesCount: 0,
      author: {
        id: UsersFaker.fake().id.value,
        entity: ChallengesFaker.fakeDto().author.entity,
      },
    })

    setupStore()
    setupAuth()
    jest.mocked(useToastContext).mockReturnValue({
      show: jest.fn(),
      showSuccess: jest.fn(),
      showError,
    } as ReturnType<typeof useToastContext>)
  })

  it('should apply the optimistic vote and confirm the action response vote', async () => {
    const onVoteChallenge = jest.fn().mockResolvedValue(
      new ActionResponse({
        data: { userChallengeVote: 'upvote' },
      }),
    )

    const { result } = Hook(onVoteChallenge)

    await act(async () => {
      await result.current.handleVoteButtonClick('upvote')
    })

    expect(onVoteChallenge).toHaveBeenCalledWith(challenge.id.value, 'upvote')
    expect(setChallenge).toHaveBeenCalled()
    expect(result.current.challengeVote?.value).toBe('upvote')
    expect(result.current.upvotesCount).toBe(2)
  })

  it('should rollback to the initial state and show toast when voting fails', async () => {
    const onVoteChallenge = jest
      .fn()
      .mockResolvedValue(
        new ActionResponse({ errorMessage: 'Failed to vote on challenge' }),
      )

    const { result } = Hook(onVoteChallenge)

    await act(async () => {
      await result.current.handleVoteButtonClick('upvote')
    })

    expect(showError).toHaveBeenCalledWith('Failed to vote on challenge')
    expect(result.current.challengeVote?.value).toBe('none')
    expect(result.current.upvotesCount).toBe(1)
    expect(challenge.downvotesCount.value).toBe(0)
  })

  it('should expose whether the current user is the challenge author', () => {
    challenge = ChallengesFaker.fake({
      author: {
        id: user.id.value,
        entity: ChallengesFaker.fakeDto().author.entity,
      },
    })

    setupStore()

    const { result } = Hook()

    expect(result.current.isUserChallengeAuthor).toBe(true)
  })
})
