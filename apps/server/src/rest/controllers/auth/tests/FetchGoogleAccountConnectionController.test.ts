import { type Mock, mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { FetchGoogleAccountConnectionController } from '../FetchGoogleAccountConnectionController'

describe('Fetch Google Account Connection Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new FetchGoogleAccountConnectionController(service)
  })

  it('should call the auth service to fetch google account connection', async () => {
    const restResponse = new RestResponse({ body: { isConnected: true } })
    service.fetchGoogleAccountConnection.mockResolvedValue(restResponse)

    const response = await controller.handle(http)

    expect(service.fetchGoogleAccountConnection).toHaveBeenCalled()
    expect(response).toEqual(restResponse)
  })
})
