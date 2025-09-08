import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { SessionFaker } from '@stardust/core/auth/structures/fakers'
import { Text } from '@stardust/core/global/structures'

import { COOKIES, ROUTES } from '@/constants'
import { ConfirmEmailController } from '../ConfirmEmailController'

describe('Confirm Email Controller', () => {
  let http: Mock<Http>
  let authService: Mock<AuthService>
  let controller: Controller
  const token = Text.create('fake-token')
  const session = SessionFaker.fakeDto()

  beforeEach(() => {
    http = mock()
    authService = mock<AuthService>()
    http.getQueryParams.mockImplementation()
    http.redirect.mockImplementation()
    http.setCookie.mockImplementation()
    authService.confirmEmail.mockImplementation()
    controller = ConfirmEmailController(authService)
  })

  it('should try to confirm email with the token', async () => {
    http.getQueryParams.mockReturnValue({ token: token.value })
    authService.confirmEmail.mockResolvedValueOnce(new RestResponse({ body: session }))

    await controller.handle(http)

    expect(authService.confirmEmail).toHaveBeenCalledWith(token)
  })

  it('should redirect to the sign in page with the error message as query param if any error is found when confirming email', async () => {
    const response = new RestResponse({
      statusCode: HTTP_STATUS_CODE.unauthorized,
      errorMessage: 'fake-error-message',
      body: session,
    })
    http.getQueryParams.mockReturnValue({ token: token.value })
    authService.confirmEmail.mockResolvedValue(response)

    await controller.handle(http)

    expect(http.redirect).toHaveBeenCalledWith(
      `${ROUTES.auth.signIn}?error=fake-error-message`,
    )
  })

  it('should set cookies for access and refresh tokens if the email was successfully confirmed', async () => {
    const response = new RestResponse({
      statusCode: HTTP_STATUS_CODE.ok,
      body: session,
    })
    http.getQueryParams.mockReturnValue({ token: token.value })
    authService.confirmEmail.mockResolvedValue(response)

    await controller.handle(http)

    expect(http.setCookie).toHaveBeenCalledTimes(2)
    expect(http.setCookie).toHaveBeenNthCalledWith(
      1,
      COOKIES.accessToken.key,
      session.accessToken,
      session.durationInSeconds,
    )
    expect(http.setCookie).toHaveBeenNthCalledWith(
      2,
      COOKIES.refreshToken.key,
      session.refreshToken,
      COOKIES.refreshToken.durationInSeconds,
    )
  })

  it.only('should redirect to the account confirmation page if the email was successfully confirmed', async () => {
    const response = new RestResponse({
      statusCode: HTTP_STATUS_CODE.ok,
      body: session,
    })
    http.getQueryParams.mockReturnValue({ token: token.value })
    authService.confirmEmail.mockResolvedValue(response)

    await controller.handle(http)

    expect(http.redirect).toHaveBeenCalledWith(ROUTES.auth.accountConfirmation)
  })
})
