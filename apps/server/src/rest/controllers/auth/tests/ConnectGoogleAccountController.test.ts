import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Text } from '@stardust/core/global/structures'
import { ConnectGoogleAccountController } from '../ConnectGoogleAccountController'

describe('Connect Google Account Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new ConnectGoogleAccountController(service)
  })

  it('should call the auth service with the correct return url', async () => {
    const returnUrl = Text.create('test-return-url')
    const restResponse = new RestResponse({ body: { signInUrl: 'test-sign-in-url' } })
    http.getQueryParams.mockReturnValue({ returnUrl: returnUrl.value })
    service.connectGoogleAccount.mockResolvedValue(restResponse)

    const response = await controller.handle(http)

    expect(service.connectGoogleAccount).toHaveBeenCalledWith(returnUrl)
    expect(response).toEqual(restResponse)
  })
})
