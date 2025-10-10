import { mock, type Mock } from 'ts-jest-mocker'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { VerifyAuthenticationController } from '../VerifyAuthenticationController'
import { AccountsFaker } from '@stardust/core/auth/entities/fakers'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

describe('Verify Authentication Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    service.fetchAccount.mockImplementation()
    http.pass.mockImplementation()
    controller = new VerifyAuthenticationController(service)
  })

  it('should call the auth service to fetch account', async () => {
    const restResponse = new RestResponse({ body: AccountsFaker.fakeDto() })
    service.fetchAccount.mockResolvedValue(restResponse)

    await controller.handle(http)

    expect(service.fetchAccount).toHaveBeenCalled()
    expect(http.pass).toHaveBeenCalled()
  })

  it('should throw an error if the auth service returns a failure', async () => {
    const restResponse = new RestResponse({
      statusCode: HTTP_STATUS_CODE.unauthorized,
      body: AccountsFaker.fakeDto(),
    })
    service.fetchAccount.mockResolvedValue(restResponse)

    await expect(controller.handle(http)).rejects.toThrow()

    expect(service.fetchAccount).toHaveBeenCalled()
    expect(http.pass).not.toHaveBeenCalled()
  })
})
