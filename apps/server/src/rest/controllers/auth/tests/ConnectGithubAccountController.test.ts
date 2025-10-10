import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Text } from '@stardust/core/global/structures'
import { ConnectGithubAccountController } from '../ConnectGithubAccountController'

describe('Connect Github Account Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new ConnectGithubAccountController(service)
  })

  it('should call the auth service with the correct token', async () => {
    const returnUrl = Text.create('test-return-url')
    const restResponse = new RestResponse({ body: { signInUrl: 'test-sign-in-url' } })
    http.getQueryParams.mockReturnValue({ returnUrl: returnUrl.value })
    service.connectGithubAccount.mockResolvedValue(restResponse)

    const response = await controller.handle(http)

    expect(service.connectGithubAccount).toHaveBeenCalledWith(returnUrl)
    expect(response).toEqual(restResponse)
  })
})
