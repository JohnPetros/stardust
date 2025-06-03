import { mock } from 'ts-jest-mocker'

import { ConfirmEmailController } from '../ConfirmEmailController'
import { ROUTES } from '@/constants'
import { RestResponse } from '@stardust/core/global/responses'
import type { Http } from '@stardust/core/global/interfaces'
import { HttpMock } from '../../tests/mocks'
import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { AuthService } from '@stardust/core/auth/interfaces'

const fakeSchema = { queryParams: { token: 'fake-token' } }

let httpMock: Http<typeof fakeSchema>
let authServiceMock: AuthService

describe('Confirm Email Controller', () => {
  beforeEach(() => {
    httpMock = HttpMock({
      fakeSchema,
    })
    authServiceMock = mock()
  })

  it('should redirect to the sign in page if any error is found when confirming email', async () => {
    const authServiceResponse = new RestResponse({
      statusCode: HTTP_STATUS_CODE.unauthorized,
    })
    authServiceMock.confirmEmail = async () => authServiceResponse
    const controller = ConfirmEmailController(authServiceMock)
    const controllerResponse = await controller.handle(httpMock)

    expect(controllerResponse.isRedirecting).toBeTruthy()
    const newRoute = controllerResponse.getHeader(HTTP_HEADERS.location)
    expect(
      String(newRoute).endsWith(`error=${authServiceResponse.errorMessage}`),
    ).toBeTruthy()
  })

  it('should redirect to the account confirmation route if the email was successfully confirmed', async () => {
    const authServiceResponse = new RestResponse({
      statusCode: HTTP_STATUS_CODE.ok,
    })
    authServiceMock.confirmEmail = async () => authServiceResponse
    const controller = ConfirmEmailController(authServiceMock)
    const controllerResponse = await controller.handle(httpMock)

    expect(controllerResponse.isRedirecting).toBeTruthy()
    const newRoute = controllerResponse.getHeader(HTTP_HEADERS.location)
    expect(String(newRoute).startsWith(ROUTES.auth.accountConfirmation)).toBeTruthy()
  })
})
