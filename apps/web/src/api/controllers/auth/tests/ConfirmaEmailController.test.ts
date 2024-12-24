import { AuthServiceMock } from '@/@core/__tests__/mocks/services'

import { HttpMock } from '@/infra/api/next/tests/mocks'
import { ConfirmEmailController } from '../ConfirmEmailController'
import { ConfirmEmailUnexpectedError, TokenNotFoundError } from '@/@core/errors/auth'
import { ROUTES } from '@/constants'
import { ApiResponse } from '@stardust/core/responses'
import { IHttp } from '@stardust/core/interfaces'

let httpMock: IHttp
let authServiceMock: AuthServiceMock

describe('Confirm Email Controller', () => {
  beforeEach(() => {
    httpMock = HttpMock({ fakeSearchParams: { token: 'fake-token' } })
    authServiceMock = new AuthServiceMock()
  })

  it('should redirect to the sign in page if any auth token from url is not found', async () => {
    httpMock = HttpMock({ fakeSearchParams: {} })

    const controller = ConfirmEmailController(authServiceMock)

    const response = await controller.handle(httpMock)

    const error = new TokenNotFoundError()
    const url = String(response.body)

    expect(url.startsWith(ROUTES.auth.signIn))
    expect(url.endsWith(`error=${error.message}`))
  })

  it('should redirect to the sign in page if any error is found on confirm email', async () => {
    authServiceMock.confirmEmail = async () =>
      new ApiResponse(false, ConfirmEmailUnexpectedError)

    const controller = ConfirmEmailController(authServiceMock)

    const response = await controller.handle(httpMock)

    const error = new ConfirmEmailUnexpectedError()

    const url = String(response.body)

    expect(url.startsWith(ROUTES.auth.signIn)).toBeTruthy()
    expect(url.endsWith(`error=${error.message}`))
  })

  it('should redirect to the account confirmation route if the email was successfully confirmed', async () => {
    authServiceMock.confirmEmail = async () => new ApiResponse(true)

    const controller = ConfirmEmailController(authServiceMock)

    const response = await controller.handle(httpMock)

    expect(String(response.body).startsWith(ROUTES.accountConfirmation)).toBeTruthy()
  })
})
