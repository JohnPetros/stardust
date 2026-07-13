import { act } from 'react'
import { renderHook, waitFor } from '@testing-library/react'

import { Id, Name } from '@stardust/core/global/structures'
import { UserCreatedEvent } from '@stardust/core/profile/events'

import { useSocialAccountConfirmationPage } from '../useSocialAccountConfirmationPage'
import { animationRefMock } from '@/ui/global/widgets/components/Animation/tests/mocks'
import { useRouterMock } from '@/ui/global/hooks/tests/mocks/useRouterMock'

jest.mock('@/ui/global/hooks/useHashParam', () => ({
  useHashParam: jest.fn((param: string) => {
    if (param === 'access_token') return 'access-token'
    if (param === 'refresh_token') return 'refresh-token'
    return null
  }),
}))

jest.mock('@/ui/global/hooks/useNavigationProvider')
jest.mock('@/ui/global/hooks/useSleep', () => ({
  useSleep: () => ({
    sleep: jest.fn().mockResolvedValue(undefined),
  }),
}))

describe('useSocialAccountConfirmationPage', () => {
  const onRetryUserCreation = jest.fn()
  const onSignUpWithSocialAccount = jest.fn()
  const onRefetchUser = jest.fn()
  const unsubscribe = jest.fn()
  const onCreateUser = jest.fn()
  let user: never | null = null

  const account = {
    email: { value: 'john@example.com' },
  } as never

  const profileChannel = {
    onCreateUser: jest.fn((listener: (event: UserCreatedEvent) => void) => {
      onCreateUser.mockImplementation(listener)
      return unsubscribe
    }),
  } as never

  const Hook = () =>
    useSocialAccountConfirmationPage({
      rocketAnimationRef: animationRefMock,
      account,
      user,
      profileChannel,
      onRefetchUser,
      onRetryUserCreation,
      onSignUpWithSocialAccount,
    })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    user = null
    onRefetchUser.mockResolvedValue(undefined)
    useRouterMock()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should keep user pending for a new social account until creation event arrives', async () => {
    onSignUpWithSocialAccount.mockResolvedValueOnce({ isNewAccount: true })

    const { result } = renderHook(Hook)

    await waitFor(() => {
      expect(onSignUpWithSocialAccount).toHaveBeenCalledWith(
        'access-token',
        'refresh-token',
      )
    })

    expect(result.current.isNewAccount).toBe(true)
    expect(result.current.isUserCreated).toBe(false)

    await act(async () => {
      jest.advanceTimersByTime(7000)
      await Promise.resolve()
    })

    expect(result.current.isRetryVisible).toBe(true)
    expect(onRefetchUser).toHaveBeenCalledTimes(1)

    act(() => {
      onCreateUser(
        new UserCreatedEvent({
          userId: Id.create().value,
          userName: 'John Doe',
          userEmail: 'john@example.com',
          userSlug: Name.create('John Doe').slug.value,
        }),
      )
    })

    expect(result.current.isUserCreated).toBe(true)
    expect(result.current.isRetryVisible).toBe(false)
  })

  it('should mark user as created when the authenticated profile is already available', async () => {
    user = {
      email: { value: 'john@example.com' },
    } as never
    onSignUpWithSocialAccount.mockResolvedValueOnce({ isNewAccount: true })

    const { result } = renderHook(Hook)

    await waitFor(() => {
      expect(onSignUpWithSocialAccount).toHaveBeenCalledWith(
        'access-token',
        'refresh-token',
      )
    })

    expect(result.current.isNewAccount).toBe(true)
    expect(result.current.isUserCreated).toBe(true)
    expect(result.current.isRetryVisible).toBe(false)
  })

  it('should mark user as created immediately when social sign in returns an existing account', async () => {
    onSignUpWithSocialAccount.mockResolvedValueOnce({ isNewAccount: false })

    const { result } = renderHook(Hook)

    await waitFor(() => {
      expect(onSignUpWithSocialAccount).toHaveBeenCalledWith(
        'access-token',
        'refresh-token',
      )
    })

    expect(result.current.isNewAccount).toBe(false)
    expect(result.current.isUserCreated).toBe(true)
  })
})
