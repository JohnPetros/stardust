import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { ROUTES } from '@/constants'
import { ConfirmEmailController } from '../ConfirmEmailController'

describe('Confirm Email Controller', () => {
  let http: Mock<Http>
  let authService: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    authService = mock<AuthService>()
    http.getQueryParams.mockImplementation()
    http.redirect.mockImplementation()
    authService.confirmEmail.mockImplementation()
    controller = ConfirmEmailController(authService)
  })

  it('should try to confirm email with the token', async () => {
    const token = 'fake-token'
    http.getQueryParams.mockReturnValue({ token })

    await controller.handle(http)

    expect(authService.confirmEmail).toHaveBeenCalledWith(token)
  })

  it('should redirect to the sign in page with the error message as query param if any error is found when confirming email', async () => {
    const token = 'fake-token'
    const response = new RestResponse({
      statusCode: HTTP_STATUS_CODE.unauthorized,
      errorMessage: 'fake-error-message',
    })
    http.getQueryParams.mockReturnValue({ token })
    authService.confirmEmail.mockResolvedValue(response)

    await controller.handle(http)

    expect(http.redirect).toHaveBeenCalledWith(
      `${ROUTES.auth.signIn}?error=fake-error-message`,
    )
  })

  it('should redirect to the account confirmation page if the email was successfully confirmed', async () => {
    const response = new RestResponse({
      statusCode: HTTP_STATUS_CODE.ok,
    })
    authService.confirmEmail.mockResolvedValue(response)

    await controller.handle(http)

    expect(http.redirect).toHaveBeenCalledWith(ROUTES.auth.accountConfirmation)
  })
})
