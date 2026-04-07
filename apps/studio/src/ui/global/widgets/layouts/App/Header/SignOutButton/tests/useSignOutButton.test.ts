import { act, renderHook } from '@testing-library/react'
import { mock, type Mock } from 'ts-jest-mocker'

import type { AuthService } from '@stardust/core/auth/interfaces'
import type { NavigationProvider } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import { ROUTES } from '@/constants'

import { useSignOutButton } from '../useSignOutButton'

describe('useSignOutButton', () => {
  let authService: Mock<AuthService>
  let navigationProvider: Mock<NavigationProvider>
  let onSignOut: jest.Mock

  const Hook = () =>
    renderHook(() =>
      useSignOutButton({
        authService,
        navigationProvider,
        onSignOut,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()

    authService = mock<AuthService>()
    navigationProvider = mock<NavigationProvider>()
    onSignOut = jest.fn()

    authService.signOut.mockResolvedValue(new RestResponse({ statusCode: 200 }))
    navigationProvider.goTo = jest.fn()
  })

  it('should sign out, clear local session and navigate to index', async () => {
    const { result } = Hook()

    await act(async () => {
      await result.current.handleClick()
    })

    expect(authService.signOut).toHaveBeenCalled()
    expect(onSignOut).toHaveBeenCalled()
    expect(navigationProvider.goTo).toHaveBeenCalledWith(ROUTES.index)
  })
})
