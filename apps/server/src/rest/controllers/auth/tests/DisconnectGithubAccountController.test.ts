import { type Mock, mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { DisconnectGithubAccountController } from '../DisconnectGithubAccountController'

describe('Disconnect Github Account Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new DisconnectGithubAccountController(service)
  })

  it('should call the auth service to disconnect github account', async () => {
    const restResponse = new RestResponse()
    service.disconnectGithubAccount.mockResolvedValue(restResponse)

    const response = await controller.handle(http)

    expect(service.disconnectGithubAccount).toHaveBeenCalled()
    expect(response).toEqual(restResponse)
  })
})
