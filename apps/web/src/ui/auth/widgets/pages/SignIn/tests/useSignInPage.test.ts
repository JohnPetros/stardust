import { act } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { type Mock, mock } from 'ts-jest-mocker'

import type { AuthService } from '@stardust/core/auth/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { RestResponse } from '@stardust/core/global/responses'

import { useSignInPage } from '../useSignInPage'
import { animationRefMock } from '@/ui/global/widgets/components/Animation/tests/mocks'
import { useToastContextMock } from '@/ui/global/contexts/ToastContext/tests/mocks'
import { useRouterMock } from '@/ui/global/hooks/tests/mocks/useRouterMock'

jest.mock('@/ui/global/hooks/useAuthContext')
jest.mock('@/ui/global/contexts/ToastContext')
jest.mock('@/ui/global/hooks/useNavigationProvider')
jest.mock('@/ui/global/hooks/useSleep', () => ({
  useSleep: () => ({
    sleep: jest.fn().mockResolvedValue(undefined),
  }),
}))

describe('useSignInPage hook', () => {
  const email = 'fake@email.com'
  const password = 'fake password'
  const error = 'fake error'
  const nextRoute = 'fake next route'
  let handleSignIn: jest.Mock
  let authService: Mock<AuthService>

  const Hook = () =>
    useSignInPage({
      rocketAnimationRef: animationRefMock,
      error,
      nextRoute,
      handleSignIn,
      authService,
    })

  beforeEach(() => {
    handleSignIn = jest.fn()
    authService = mock<AuthService>()
    useToastContextMock()
    useRouterMock()
  })

  it('should call handleSignIn with email and password when form is submitted', async () => {
    const { result } = renderHook(Hook)

    await act(async () => {
      await result.current.handleFormSubmit({ email, password })
    })

    expect(handleSignIn).toHaveBeenCalledWith(email, password)
  })

  it('should do nothing if handleSignIn returns failed', async () => {
    handleSignIn.mockResolvedValueOnce('failed')

    const { result } = renderHook(Hook)

    await act(async () => {
      await result.current.handleFormSubmit({ email, password })
    })

    expect(result.current.isRocketVisible).toBe(false)
    expect(result.current.unconfirmedEmail).toBeNull()
  })

  it('should make rocket animation visible and restart it if handleSignIn returns signed-in', async () => {
    handleSignIn.mockResolvedValueOnce('signed-in')

    const { result } = renderHook(Hook)

    await act(async () => {
      await result.current.handleFormSubmit({ email, password })
    })

    await waitFor(() => {
      expect(result.current.isRocketVisible).toBe(true)
      expect(animationRefMock.current.restart).toHaveBeenCalled()
    })
  })

  it('should show error toast when an error is provided', async () => {
    const { showError } = useToastContextMock()

    renderHook(Hook)

    expect(showError).toHaveBeenCalledWith(error, expect.any(Number))
  })

  it('should keep the submitted email without starting the rocket when the email is not confirmed', async () => {
    handleSignIn.mockResolvedValueOnce('email-not-confirmed')

    const { result } = renderHook(Hook)

    await act(async () => {
      await result.current.handleFormSubmit({ email, password })
    })

    expect(result.current.unconfirmedEmail).toBe(email)
    expect(result.current.isRocketVisible).toBe(false)
  })

  it('should clear the unconfirmed email when a new submission fails', async () => {
    handleSignIn
      .mockResolvedValueOnce('email-not-confirmed')
      .mockResolvedValueOnce('failed')

    const { result } = renderHook(Hook)

    await act(async () => {
      await result.current.handleFormSubmit({ email, password })
    })
    expect(result.current.unconfirmedEmail).toBe(email)

    await act(async () => {
      await result.current.handleFormSubmit({ email, password })
    })

    expect(result.current.unconfirmedEmail).toBeNull()
  })

  it('should not call the auth service when there is no unconfirmed email', async () => {
    const { result } = renderHook(Hook)

    await act(async () => {
      await result.current.handleResendEmail()
    })

    expect(authService.resendSignUpEmail).not.toHaveBeenCalled()
  })

  it('should resend the confirmation email and show a success toast', async () => {
    const { showSuccess } = useToastContextMock()
    handleSignIn.mockResolvedValueOnce('email-not-confirmed')
    authService.resendSignUpEmail.mockResolvedValue(new RestResponse())

    const { result } = renderHook(Hook)
    await act(async () => {
      await result.current.handleFormSubmit({ email, password })
    })
    await act(async () => {
      await result.current.handleResendEmail()
    })

    expect(authService.resendSignUpEmail).toHaveBeenCalledWith(
      expect.objectContaining({ value: email }),
    )
    expect(showSuccess).toHaveBeenCalledWith(
      'Reenviamos para você o e-mail de confirmação',
      10,
    )
    expect(result.current.isResendingEmail).toBe(false)
  })

  it.each([
    ['rate limited', HTTP_STATUS_CODE.tooManyRequests, 'Aguarde alguns instantes'],
    ['unexpected', HTTP_STATUS_CODE.serverError, 'Erro inesperado'],
  ])(
    'should show the received error message when the resend is %s',
    async (_, statusCode, errorMessage) => {
      const { showError } = useToastContextMock()
      handleSignIn.mockResolvedValueOnce('email-not-confirmed')
      authService.resendSignUpEmail.mockResolvedValue(
        new RestResponse({ statusCode, errorMessage }),
      )

      const { result } = renderHook(Hook)
      await act(async () => {
        await result.current.handleFormSubmit({ email, password })
      })
      await act(async () => {
        await result.current.handleResendEmail()
      })

      expect(showError).toHaveBeenCalledWith(errorMessage, 5)
      expect(result.current.isResendingEmail).toBe(false)
    },
  )

  it('should flag the resend as loading while the request is pending', async () => {
    handleSignIn.mockResolvedValueOnce('email-not-confirmed')
    let resolveResend: (response: RestResponse) => void = () => {}
    authService.resendSignUpEmail.mockReturnValue(
      new Promise<RestResponse>((resolve) => {
        resolveResend = resolve
      }),
    )

    const { result } = renderHook(Hook)
    await act(async () => {
      await result.current.handleFormSubmit({ email, password })
    })

    let resendPromise: Promise<void> = Promise.resolve()
    act(() => {
      resendPromise = result.current.handleResendEmail()
    })
    await waitFor(() => expect(result.current.isResendingEmail).toBe(true))

    await act(async () => {
      resolveResend(new RestResponse())
      await resendPromise
    })

    expect(result.current.isResendingEmail).toBe(false)
  })
})
