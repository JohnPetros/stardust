import { type Mock, mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import { DisconnectGoogleAccountController } from '../DisconnectGoogleAccountController'

describe('Disconnect Google Account Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new DisconnectGoogleAccountController(service)
  })

  it('should call the auth service to disconnect google account', async () => {
    const restResponse = new RestResponse()
    service.disconnectGoogleAccount.mockResolvedValue(restResponse)

    const response = await controller.handle(http)

    expect(service.disconnectGoogleAccount).toHaveBeenCalled()
    expect(response).toEqual(restResponse)
  })
})
