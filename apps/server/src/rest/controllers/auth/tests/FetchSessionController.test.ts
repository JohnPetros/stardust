import { type Mock, mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { FetchSessionController } from '../FetchSessionController'
import { AccountsFaker } from '@stardust/core/auth/entities/fakers'

describe('Fetch Session Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new FetchSessionController(service)
  })

  it('should call the auth service to fetch account', async () => {
    const restResponse = new RestResponse({
      body: AccountsFaker.fakeDto(),
    })
    service.fetchAccount.mockResolvedValue(restResponse)

    const response = await controller.handle(http)

    expect(service.fetchAccount).toHaveBeenCalled()
    expect(response).toEqual(restResponse)
  })
})
