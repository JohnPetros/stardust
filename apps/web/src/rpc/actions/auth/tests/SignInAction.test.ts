import { type Mock, mock } from 'ts-jest-mocker'

import type { AuthService } from '@stardust/core/auth/interfaces'
import type { SessionDto } from '@stardust/core/auth/structures/dtos'
import { AuthError } from '@stardust/core/global/errors'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { Call } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import { COOKIES } from '@/constants'
import { SignInAction } from '../SignInAction'

describe('Sign In Action', () => {
  const request = { email: 'apollo@stardust.dev', password: 'password123' }

  let authService: Mock<AuthService>
  let call: Mock<Call<typeof request>>
  let action: ReturnType<typeof SignInAction>

  beforeEach(() => {
    authService = mock<AuthService>()
    call = mock<Call<typeof request>>()
    call.getRequest.mockReturnValue(request)
    call.setCookie.mockResolvedValue(undefined)
    action = SignInAction(authService)
  })

  it('should return an unconfirmed result without setting cookies when the service answers forbidden', async () => {
    authService.signIn.mockResolvedValue(
      new RestResponse<SessionDto>({
        errorMessage: 'Confirme seu e-mail antes de entrar',
        statusCode: HTTP_STATUS_CODE.forbidden,
      }),
    )

    await expect(action.handle(call)).resolves.toEqual({ isEmailConfirmed: false })
    expect(call.setCookie).not.toHaveBeenCalled()
  })

  it('should set the session cookies and return the account when the sign in succeeds', async () => {
    const session: SessionDto = {
      account: {
        id: 'account-id',
        email: request.email,
        name: 'Apollo',
        isAuthenticated: true,
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      durationInSeconds: 3600,
    }
    authService.signIn.mockResolvedValue(
      new RestResponse<SessionDto>({
        body: session,
        statusCode: HTTP_STATUS_CODE.created,
      }),
    )

    await expect(action.handle(call)).resolves.toEqual({
      isEmailConfirmed: true,
      account: session.account,
    })
    expect(call.setCookie).toHaveBeenCalledWith(
      COOKIES.accessToken.key,
      session.accessToken,
      session.durationInSeconds,
    )
    expect(call.setCookie).toHaveBeenCalledWith(
      COOKIES.refreshToken.key,
      session.refreshToken,
      COOKIES.refreshToken.durationInSeconds,
    )
  })

  it('should throw an auth error with the received message when the credentials are invalid', async () => {
    authService.signIn.mockResolvedValue(
      new RestResponse<SessionDto>({
        errorMessage: 'E-mail ou senha incorretos',
        statusCode: HTTP_STATUS_CODE.unauthorized,
      }),
    )

    const result = action.handle(call)

    await expect(result).rejects.toThrow(AuthError)
    await expect(result).rejects.toThrow('E-mail ou senha incorretos')
    expect(call.setCookie).not.toHaveBeenCalled()
  })
})
