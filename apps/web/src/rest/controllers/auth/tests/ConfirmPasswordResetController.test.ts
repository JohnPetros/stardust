import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { SessionFaker } from '@stardust/core/auth/structures/fakers'
import { Text, Slug } from '@stardust/core/global/structures'

import { COOKIES, ROUTES } from '@/constants'
import { ConfirmPasswordResetController } from '../ConfirmPasswordResetController'

describe('Confirm Password Reset Controller', () => {
  let http: Mock<Http>
  let authService: Mock<AuthService>
  let controller: Controller
  const token = Text.create('fake-reset-token')
  const session = SessionFaker.fakeDto()

  beforeEach(() => {
    http = mock()
    authService = mock<AuthService>()
    http.getQueryParams.mockImplementation()
    http.redirect.mockImplementation()
    http.setCookie.mockImplementation()
    http.deleteCookie.mockImplementation()
    authService.confirmPasswordReset.mockImplementation()
    controller = ConfirmPasswordResetController(authService)
  })

  it('should try to confirm password reset with the token', async () => {
    http.getQueryParams.mockReturnValue({ token: token.value })
    authService.confirmPasswordReset.mockResolvedValueOnce(
      new RestResponse({ body: session }),
    )

    await controller.handle(http)

    expect(authService.confirmPasswordReset).toHaveBeenCalledWith(token)
  })

  it('should redirect to the sign in page with the error message as query param if any error is found when confirming password reset', async () => {
    const errorMessage = 'Invalid or expired token'
    const response = new RestResponse({
      statusCode: HTTP_STATUS_CODE.unauthorized,
      errorMessage,
      body: session,
    })
    http.getQueryParams.mockReturnValue({ token: token.value })
    authService.confirmPasswordReset.mockResolvedValue(response)

    await controller.handle(http)

    const expectedErrorSlug = Slug.create(errorMessage).value
    expect(http.redirect).toHaveBeenCalledWith(
      `${ROUTES.auth.signIn}?error=${expectedErrorSlug}`,
    )
  })

  it('should delete shouldResetPassword cookie when password reset confirmation fails', async () => {
    const response = new RestResponse({
      statusCode: HTTP_STATUS_CODE.unauthorized,
      errorMessage: 'Invalid token',
      body: session,
    })
    http.getQueryParams.mockReturnValue({ token: token.value })
    authService.confirmPasswordReset.mockResolvedValue(response)

    await controller.handle(http)

    expect(http.deleteCookie).toHaveBeenCalledWith(COOKIES.shouldResetPassword.key)
  })

  it('should set cookies for shouldResetPassword, access and refresh tokens if the password reset was successfully confirmed', async () => {
    const response = new RestResponse({
      statusCode: HTTP_STATUS_CODE.ok,
      body: session,
    })
    http.getQueryParams.mockReturnValue({ token: token.value })
    authService.confirmPasswordReset.mockResolvedValue(response)

    await controller.handle(http)

    expect(http.setCookie).toHaveBeenCalledTimes(3)
    expect(http.setCookie).toHaveBeenNthCalledWith(
      1,
      COOKIES.shouldResetPassword.key,
      'true',
      COOKIES.shouldResetPassword.durationInSeconds,
    )
    expect(http.setCookie).toHaveBeenNthCalledWith(
      2,
      COOKIES.accessToken.key,
      session.accessToken,
      session.durationInSeconds,
    )
    expect(http.setCookie).toHaveBeenNthCalledWith(
      3,
      COOKIES.refreshToken.key,
      session.refreshToken,
      COOKIES.refreshToken.durationInSeconds,
    )
  })

  it('should redirect to the reset password page if the password reset was successfully confirmed', async () => {
    const response = new RestResponse({
      statusCode: HTTP_STATUS_CODE.ok,
      body: session,
    })
    http.getQueryParams.mockReturnValue({ token: token.value })
    authService.confirmPasswordReset.mockResolvedValue(response)

    await controller.handle(http)

    expect(http.redirect).toHaveBeenCalledWith(ROUTES.auth.resetPassword)
  })

  it('should not delete shouldResetPassword cookie when password reset confirmation succeeds', async () => {
    const response = new RestResponse({
      statusCode: HTTP_STATUS_CODE.ok,
      body: session,
    })
    http.getQueryParams.mockReturnValue({ token: token.value })
    authService.confirmPasswordReset.mockResolvedValue(response)

    await controller.handle(http)

    expect(http.deleteCookie).not.toHaveBeenCalled()
  })
})
