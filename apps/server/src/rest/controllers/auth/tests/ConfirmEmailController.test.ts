import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Text } from '@stardust/core/global/structures'
import { SessionFaker } from '@stardust/core/auth/structures/fakers'
import { ConfirmEmailController } from '../ConfirmEmailController'

describe('Confirm Email Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new ConfirmEmailController(service)
  })

  it('should call the auth service with the correct token', async () => {
    const token = Text.create('test-token')
    const restResponse = new RestResponse({ body: SessionFaker.fakeDto() })
    http.getBody.mockResolvedValue({ token: token.value })
    service.confirmEmail.mockResolvedValue(restResponse)

    const response = await controller.handle(http)

    expect(service.confirmEmail).toHaveBeenCalledWith(token)
    expect(response).toEqual(restResponse)
  })
})
