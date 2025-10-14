import { type Mock, mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import { FetchGithubAccountConnectionController } from '../FetchGithubAccountConnectionController'

describe('Fetch Github Account Connection Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new FetchGithubAccountConnectionController(service)
  })

  it('should call the auth service to fetch github account connection', async () => {
    const restResponse = new RestResponse({ body: { isConnected: true } })
    service.fetchGithubAccountConnection.mockResolvedValue(restResponse)

    const response = await controller.handle(http)

    expect(service.fetchGithubAccountConnection).toHaveBeenCalled()
    expect(response).toEqual(restResponse)
  })
})
