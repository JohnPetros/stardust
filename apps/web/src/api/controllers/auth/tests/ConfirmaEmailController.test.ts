import { ConfirmEmailController } from '../ConfirmEmailController'
import { ROUTES } from '@/constants'
import { ApiResponse } from '@stardust/core/responses'
import type { IHttp } from '@stardust/core/interfaces'
import { AuthServiceMock } from '@stardust/core/mocks/services'
import { HttpMock } from '../../tests/mocks'
import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/constants'

const fakeSchema = { queryParams: { token: 'fake-token' } }

let httpMock: IHttp<typeof fakeSchema>
let authServiceMock: AuthServiceMock

describe('Confirm Email Controller', () => {
  beforeEach(() => {
    httpMock = HttpMock({
      fakeSchema,
    })
    authServiceMock = new AuthServiceMock()
  })

  it('should redirect to the sign in page if any error is found when confirming email', async () => {
    const authServiceResponse = new ApiResponse({
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
    const authServiceResponse = new ApiResponse({
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
