import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker, Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Text } from '@stardust/core/global/structures'
import { SessionFaker } from '@stardust/core/auth/structures/fakers'

import { ConfirmEmailController } from '../ConfirmEmailController'
import { UserSignedInEvent } from '@stardust/core/auth/events'

describe('Confirm Email Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let broker: Mock<Broker>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    broker = mock<Broker>()
    broker.publish.mockImplementation()
    controller = new ConfirmEmailController(service, broker)
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

  it('should call the event broker to publish the user signed in event', async () => {
    const token = Text.create('test-token')
    const restResponse = new RestResponse({ body: SessionFaker.fakeDto() })
    http.getBody.mockResolvedValue({ token: token.value })
    service.confirmEmail.mockResolvedValue(restResponse)

    await controller.handle(http)

    expect(broker.publish).toHaveBeenCalledWith(
      new UserSignedInEvent({
        userId: String(restResponse.body.account.id),
        platform: 'web',
      }),
    )
  })
})
