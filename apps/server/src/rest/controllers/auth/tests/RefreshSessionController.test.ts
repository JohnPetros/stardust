import { type Mock, mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { RefreshSessionController } from '../RefreshSessionController'
import { AccountsFaker } from '@stardust/core/auth/entities/fakers'
import { SessionFaker } from '@stardust/core/auth/structures/fakers'
import { Text } from '@stardust/core/global/structures'

describe('Refresh Session Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new RefreshSessionController(service)
  })

  it('should call the auth service to refresh session', async () => {
    const restResponse = new RestResponse({
      body: SessionFaker.fakeDto(),
    })
    const refreshToken = Text.create('test-refresh-token')
    service.refreshSession.mockResolvedValue(restResponse)
    http.getBody.mockResolvedValue({ refreshToken: refreshToken.value })

    const response = await controller.handle(http)

    expect(service.refreshSession).toHaveBeenCalled()
    expect(response).toEqual(restResponse)
  })
})
