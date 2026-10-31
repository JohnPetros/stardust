import { act, renderHook } from '@testing-library/react'
import { mock, type Mock } from 'ts-jest-mocker'
import { useSessionStorage } from 'usehooks-ts'

import type { AuthService } from '@stardust/core/auth/interfaces'
import type { NavigationProvider, ToastProvider } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { SessionFaker } from '@stardust/core/auth/structures/fakers'

import { ROUTES, SESSION_STORAGE_KEYS } from '@/constants'

import { useSignInForm } from '../useSignInForm'

jest.mock('usehooks-ts', () => ({
  useSessionStorage: jest.fn(),
}))

describe('useSignInForm', () => {
  let authService: Mock<AuthService>
  let toastProvider: Mock<ToastProvider>
  let navigationProvider: Mock<NavigationProvider>
  let setAccessToken: jest.Mock
  let setRefreshToken: jest.Mock

  const Hook = () =>
    renderHook(() =>
      useSignInForm({
        authService,
        toastProvider,
        navigationProvider,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()

    authService = mock<AuthService>()
    toastProvider = mock<ToastProvider>()
    navigationProvider = mock<NavigationProvider>()

    toastProvider.showSuccess = jest.fn()
    toastProvider.showError = jest.fn()
    navigationProvider.goTo = jest.fn()

    setAccessToken = jest.fn()
    setRefreshToken = jest.fn()

    jest.mocked(useSessionStorage).mockImplementation(((key: string) => {
      if (key === SESSION_STORAGE_KEYS.accessToken) return ['', setAccessToken, jest.fn()]
      if (key === SESSION_STORAGE_KEYS.refreshToken)
        return ['', setRefreshToken, jest.fn()]

      return ['', jest.fn(), jest.fn()]
    }) as unknown as typeof useSessionStorage)
  })

  it('should persist tokens, show success toast and navigate to dashboard on successful sign in', async () => {
    const session = SessionFaker.fakeDto()

    authService.signInGodAccount.mockResolvedValue(
      new RestResponse({
        statusCode: 200,
        body: {
          ...session,
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      }),
    )

    const { result } = Hook()

    act(() => {
      result.current.form.setValue('email', 'admin@stardust.dev')
      result.current.form.setValue('password', '123456')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(authService.signInGodAccount).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'admin@stardust.dev' }),
      expect.objectContaining({ value: '123456' }),
    )
    expect(toastProvider.showSuccess).toHaveBeenCalledWith('Login realizado com sucesso')
    expect(setAccessToken).toHaveBeenCalledWith('access-token')
    expect(setRefreshToken).toHaveBeenCalledWith('refresh-token')
    expect(navigationProvider.goTo).toHaveBeenCalledWith(ROUTES.dashboard)
    expect(toastProvider.showError).not.toHaveBeenCalled()
  })

  it('should show error toast when sign in fails', async () => {
    authService.signInGodAccount.mockResolvedValue(
      new RestResponse({
        statusCode: 401,
        errorMessage: 'Credenciais inválidas',
      }),
    )

    const { result } = Hook()

    act(() => {
      result.current.form.setValue('email', 'admin@stardust.dev')
      result.current.form.setValue('password', '123456')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(toastProvider.showError).toHaveBeenCalledWith('Credenciais inválidas')
    expect(setAccessToken).not.toHaveBeenCalled()
    expect(setRefreshToken).not.toHaveBeenCalled()
    expect(navigationProvider.goTo).not.toHaveBeenCalled()
    expect(toastProvider.showSuccess).not.toHaveBeenCalled()
  })
})
