import { act, renderHook } from '@testing-library/react'
import { type Mock, mock } from 'ts-jest-mocker'

import { AccountsFaker } from '@stardust/core/auth/entities/fakers'
import type { Account } from '@stardust/core/auth/entities'
import { Name } from '@stardust/core/global/structures'
import { RestResponse } from '@stardust/core/global/responses'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UserCreatedEvent } from '@stardust/core/profile/events'
import type { ProfileService } from '@stardust/core/profile/interfaces'

import { PROFILE_CREATION_POLLING } from '@/constants'
import { useProfileCreationPolling } from '../useProfileCreationPolling'

const { intervalInMs, maxBackoffInMs, timeoutInMs } = PROFILE_CREATION_POLLING

describe('useProfileCreationPolling', () => {
  let profileService: Mock<ProfileService>
  let listener: jest.Mock<void, [UserCreatedEvent]>

  type Params = {
    account: Account | null
    accessToken: string | null
  }

  const Hook = (params?: Partial<Params>) =>
    renderHook(
      (props: Params) => useProfileCreationPolling({ profileService, ...props }),
      {
        initialProps: {
          account: AccountsFaker.fake({ isAuthenticated: true }),
          accessToken: 'token',
          ...params,
        } as Params,
      },
    )

  const attempt = (isUserCreated: boolean) =>
    new RestResponse({
      body: {
        account: { id: 'account-id', email: 'user@stardust.dev', name: 'Maria Silva' },
        expiresAt: new Date().toISOString(),
        isUserCreated,
      },
    })

  async function advance(ms: number) {
    await act(async () => {
      await jest.advanceTimersByTimeAsync(ms)
    })
  }

  beforeEach(() => {
    jest.useFakeTimers()
    profileService = mock<ProfileService>()
    listener = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('bearer session', () => {
    it('should deliver the user as created event and query by the account id', async () => {
      const user = UsersFaker.fake()
      const account = AccountsFaker.fake({ id: user.id.value, isAuthenticated: true })
      profileService.fetchUserById.mockResolvedValue(new RestResponse({ body: user.dto }))
      const { result } = Hook({ account })

      result.current.onCreateUser(listener)
      await advance(0)

      expect(profileService.fetchUserById).toHaveBeenCalledWith(account.id)
      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener.mock.calls[0][0].payload).toEqual({
        userId: user.id.value,
        userName: user.name.value,
        userEmail: user.email.value,
        userSlug: user.slug.value,
      })
    })

    it('should keep polling on 404 and deliver once the user exists', async () => {
      const user = UsersFaker.fake()
      profileService.fetchUserById
        .mockResolvedValueOnce(new RestResponse({ statusCode: 404, errorMessage: 'x' }))
        .mockResolvedValueOnce(new RestResponse({ statusCode: 404, errorMessage: 'x' }))
        .mockResolvedValue(new RestResponse({ body: user.dto }))
      const { result } = Hook()

      result.current.onCreateUser(listener)
      await advance(0)
      expect(profileService.fetchUserById).toHaveBeenCalledTimes(1)
      await advance(intervalInMs)
      expect(profileService.fetchUserById).toHaveBeenCalledTimes(2)
      expect(listener).not.toHaveBeenCalled()
      await advance(intervalInMs)

      expect(profileService.fetchUserById).toHaveBeenCalledTimes(3)
      expect(listener).toHaveBeenCalledTimes(1)
      await advance(intervalInMs * 5)
      expect(profileService.fetchUserById).toHaveBeenCalledTimes(3)
    })

    it.each([401, 403])('should stop without event on %s', async (statusCode) => {
      profileService.fetchUserById.mockResolvedValue(
        new RestResponse({ statusCode, errorMessage: 'x' }),
      )
      const { result } = Hook()

      result.current.onCreateUser(listener)
      await advance(intervalInMs * 5)

      expect(profileService.fetchUserById).toHaveBeenCalledTimes(1)
      expect(listener).not.toHaveBeenCalled()
    })

    it('should back off 4000, 8000 and 8000 ms on 500 and rejection, then return to 2000 ms after pending', async () => {
      profileService.fetchUserById
        .mockResolvedValueOnce(new RestResponse({ statusCode: 500, errorMessage: 'x' }))
        .mockRejectedValueOnce(new Error('network'))
        .mockResolvedValueOnce(new RestResponse({ statusCode: 500, errorMessage: 'x' }))
        .mockResolvedValueOnce(new RestResponse({ statusCode: 404, errorMessage: 'x' }))
        .mockResolvedValue(new RestResponse({ statusCode: 404, errorMessage: 'x' }))
      const { result } = Hook()

      result.current.onCreateUser(listener)
      await advance(0)
      expect(profileService.fetchUserById).toHaveBeenCalledTimes(1)
      await advance(intervalInMs * 2 - 1)
      expect(profileService.fetchUserById).toHaveBeenCalledTimes(1)
      await advance(1)
      expect(profileService.fetchUserById).toHaveBeenCalledTimes(2)
      await advance(maxBackoffInMs - 1)
      expect(profileService.fetchUserById).toHaveBeenCalledTimes(2)
      await advance(1)
      expect(profileService.fetchUserById).toHaveBeenCalledTimes(3)
      await advance(maxBackoffInMs)
      expect(profileService.fetchUserById).toHaveBeenCalledTimes(4)
      await advance(intervalInMs)
      expect(profileService.fetchUserById).toHaveBeenCalledTimes(5)
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('authenticated account without access token', () => {
    it('should not request anything and expose a new channel once the token arrives', async () => {
      const user = UsersFaker.fake()
      profileService.fetchUserById.mockResolvedValue(new RestResponse({ body: user.dto }))
      const account = AccountsFaker.fake({ isAuthenticated: true })
      const { result, rerender } = Hook({ account, accessToken: null })
      const channelWithoutToken = result.current

      channelWithoutToken.onCreateUser(listener)
      await advance(intervalInMs * 3)

      expect(profileService.fetchUserById).not.toHaveBeenCalled()
      expect(listener).not.toHaveBeenCalled()

      rerender({ account, accessToken: 'token' })

      expect(result.current).not.toBe(channelWithoutToken)
      result.current.onCreateUser(listener)
      await advance(0)
      expect(profileService.fetchUserById).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledTimes(1)
    })
  })

  describe('onboarding receipt', () => {
    it('should deliver created event with slug derived from the name', async () => {
      profileService.fetchOnboardingAttempt.mockResolvedValue(attempt(true))
      const { result } = Hook({ account: null, accessToken: null })

      result.current.onCreateUser(listener)
      await advance(0)

      expect(profileService.fetchUserById).not.toHaveBeenCalled()
      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener.mock.calls[0][0].payload).toEqual({
        userId: 'account-id',
        userName: 'Maria Silva',
        userEmail: 'user@stardust.dev',
        userSlug: Name.create('Maria Silva').slug.value,
      })
    })

    it('should keep polling while the user is not created', async () => {
      profileService.fetchOnboardingAttempt.mockResolvedValue(attempt(false))
      const { result } = Hook({ account: null, accessToken: null })

      result.current.onCreateUser(listener)
      await advance(intervalInMs * 2)

      expect(profileService.fetchOnboardingAttempt).toHaveBeenCalledTimes(3)
      expect(listener).not.toHaveBeenCalled()
    })

    it('should stop without event when the attempt is absent', async () => {
      profileService.fetchOnboardingAttempt.mockResolvedValue(
        new RestResponse({ body: null }),
      )
      const { result } = Hook({ account: null, accessToken: null })

      result.current.onCreateUser(listener)
      await advance(intervalInMs * 5)

      expect(profileService.fetchOnboardingAttempt).toHaveBeenCalledTimes(1)
      expect(listener).not.toHaveBeenCalled()
    })

    it.each([401, 403])('should stop without event on %s', async (statusCode) => {
      profileService.fetchOnboardingAttempt.mockResolvedValue(
        new RestResponse({ statusCode, errorMessage: 'x' }),
      )
      const { result } = Hook({ account: null, accessToken: null })

      result.current.onCreateUser(listener)
      await advance(intervalInMs * 5)

      expect(profileService.fetchOnboardingAttempt).toHaveBeenCalledTimes(1)
      expect(listener).not.toHaveBeenCalled()
    })

    it('should back off on 502 without delivering an event', async () => {
      profileService.fetchOnboardingAttempt.mockResolvedValue(
        new RestResponse({ statusCode: 502, errorMessage: 'x' }),
      )
      const { result } = Hook({ account: null, accessToken: null })

      result.current.onCreateUser(listener)
      await advance(0)
      await advance(intervalInMs * 2)
      expect(profileService.fetchOnboardingAttempt).toHaveBeenCalledTimes(2)
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('lifecycle', () => {
    it('should never start a second request while one is in flight', async () => {
      let resolve: (response: RestResponse<unknown>) => void = () => {}
      profileService.fetchOnboardingAttempt.mockImplementation(
        () => new Promise((done) => (resolve = done)) as never,
      )
      const { result } = Hook({ account: null, accessToken: null })

      result.current.onCreateUser(listener)
      await advance(intervalInMs * 10)

      expect(profileService.fetchOnboardingAttempt).toHaveBeenCalledTimes(1)
      resolve(attempt(false))
    })

    it('should stop polling after the timeout', async () => {
      profileService.fetchOnboardingAttempt.mockResolvedValue(attempt(false))
      const { result } = Hook({ account: null, accessToken: null })

      result.current.onCreateUser(listener)
      await advance(timeoutInMs)
      const calls = profileService.fetchOnboardingAttempt.mock.calls.length
      await advance(timeoutInMs)

      expect(calls).toBeGreaterThan(1)
      expect(profileService.fetchOnboardingAttempt).toHaveBeenCalledTimes(calls)
      expect(listener).not.toHaveBeenCalled()
    })

    it('should ignore a late response after cleanup and tolerate duplicate cleanup', async () => {
      let resolve: (response: RestResponse<unknown>) => void = () => {}
      profileService.fetchOnboardingAttempt.mockImplementation(
        () => new Promise((done) => (resolve = done)) as never,
      )
      const { result } = Hook({ account: null, accessToken: null })

      const cleanup = result.current.onCreateUser(listener)
      await advance(0)
      cleanup()
      expect(() => cleanup()).not.toThrow()
      resolve(attempt(true))
      await advance(intervalInMs * 5)

      expect(listener).not.toHaveBeenCalled()
      expect(profileService.fetchOnboardingAttempt).toHaveBeenCalledTimes(1)
    })
  })
})
