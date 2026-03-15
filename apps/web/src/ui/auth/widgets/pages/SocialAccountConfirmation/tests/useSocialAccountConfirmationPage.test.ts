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
  const unsubscribe = jest.fn()
  const onCreateUser = jest.fn()

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
      profileChannel,
      onRetryUserCreation,
      onSignUpWithSocialAccount,
    })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
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

    act(() => {
      jest.advanceTimersByTime(7000)
    })

    expect(result.current.isRetryVisible).toBe(true)

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
