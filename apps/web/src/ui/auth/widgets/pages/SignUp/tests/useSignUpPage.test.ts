import { renderHook, waitFor } from '@testing-library/react'
import { type Mock, mock } from 'ts-jest-mocker'

import type { AuthService } from '@stardust/core/auth/interfaces'

import { useSignUpPage } from '../useSignUpPage'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { RestResponse } from '@stardust/core/global/responses'
import { Email, Id, Name } from '@stardust/core/global/structures'
import { Password } from '@stardust/core/auth/structures'
import { useToastContextMock } from '@/ui/global/contexts/ToastContext/tests/mocks'
import { UserCreatedEvent } from '@stardust/core/profile/events'

jest.mock('@/ui/global/contexts/ToastContext')

describe('useSignUpPage', () => {
  let authService: Mock<AuthService>
  let isUserCreated = false
  const email = 'fake@email.com'
  const password = '123456'
  const name = 'fake name'

  const Hook = () => useSignUpPage(authService, isUserCreated)

  beforeEach(() => {
    authService = mock<AuthService>()
    authService.requestSignUp.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok }),
    )
  })

  it('should request sign up with email, password and name', () => {
    const { result } = renderHook(Hook)

    result.current.handleFormSubmit(email, password, name)

    expect(authService.requestSignUp).toHaveBeenCalledWith(
      Email.create(email),
      Password.create(password),
      Name.create(name),
    )
  })

  it('should set user email when sign up requestis successful', async () => {
    authService.requestSignUp.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok }),
    )
    const { result } = renderHook(Hook)

    result.current.handleFormSubmit(email, password, name)

    await waitFor(() => {
      expect(result.current.userEmail).toEqual(Email.create(email))
    })
  })

  it('should show error message when sign up request is failure', async () => {
    const errorMessage = 'fake error message'
    authService.requestSignUp.mockResolvedValue(
      new RestResponse({
        statusCode: HTTP_STATUS_CODE.badRequest,
        errorMessage,
      }),
    )
    const { showError } = useToastContextMock()
    const { result } = renderHook(Hook)

    result.current.handleFormSubmit(email, password, name)

    await waitFor(() => {
      expect(result.current.userEmail).toBeNull()
      expect(showError).toHaveBeenCalledWith(errorMessage, expect.any(Number))
    })
  })

  it('should show success message when user is created and user email is the same as the one in the event', async () => {
    authService.requestSignUp.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok }),
    )
    const event = new UserCreatedEvent({
      userId: Id.create().value,
      userEmail: email,
      userName: name,
    })
    const { showSuccess } = useToastContextMock()
    const { result } = renderHook(Hook)

    await result.current.handleFormSubmit(email, password, name)
    await waitFor(() => expect(result.current.userEmail).toEqual(Email.create(email)))

    result.current.handleUserCreated(event)
    event.payload.userEmail = 'other-email@email.com'
    result.current.handleUserCreated(event)
    result.current.handleUserCreated(event)

    expect(showSuccess).toHaveBeenCalledTimes(1)
    expect(showSuccess).toHaveBeenCalledWith(
      'Enviamos para você um e-mail de confirmação',
      expect.any(Number),
    )
  })

  it('should show error message when resend email is called and user is created', async () => {
    isUserCreated = true
    const { showError } = useToastContextMock()
    const { result } = renderHook(Hook)

    await result.current.handleResendEmail()

    expect(showError).toHaveBeenCalledWith(
      'Seu cadastro já foi confirmado',
      expect.any(Number),
    )
  })

  it('should show error message when resend sign up email request is failure', async () => {
    const errorMessage = 'fake error message'
    authService.requestSignUp.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok }),
    )
    authService.resendSignUpEmail.mockResolvedValue(
      new RestResponse({
        statusCode: HTTP_STATUS_CODE.serverError,
        errorMessage,
      }),
    )
    const { showError } = useToastContextMock()
    const { result } = renderHook(Hook)

    await result.current.handleFormSubmit(email, password, name)
    await waitFor(() => expect(result.current.userEmail).toEqual(Email.create(email)))

    await result.current.handleResendEmail()

    expect(showError).toHaveBeenCalledWith(errorMessage, expect.any(Number))
  })

  it('should show success message when resend sign up email request is successful', async () => {
    authService.requestSignUp.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok }),
    )
    authService.resendSignUpEmail.mockResolvedValue(
      new RestResponse({
        statusCode: HTTP_STATUS_CODE.ok,
      }),
    )
    const { showSuccess } = useToastContextMock()
    const { result } = renderHook(Hook)

    await result.current.handleFormSubmit(email, password, name)
    await waitFor(() => expect(result.current.userEmail).toEqual(Email.create(email)))

    await result.current.handleResendEmail()

    expect(showSuccess).toHaveBeenCalledWith(
      'Reenviamos para você o e-mail de confirmação',
      expect.any(Number),
    )
  })
})
