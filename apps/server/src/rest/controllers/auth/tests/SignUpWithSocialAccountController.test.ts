import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Broker, Http } from '@stardust/core/global/interfaces'
import { AccountsFaker } from '@stardust/core/auth/entities/fakers'
import { UserSignedUpEvent } from '@stardust/core/auth/events'

import { SignUpWithSocialAccountController } from '../SignUpWithSocialAccountController'

describe('Sign Up With Social Account Controller', () => {
  let http: Mock<Http>
  let Broker: Mock<Broker>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    Broker = mock<Broker>()
    Broker.publish.mockImplementation()
    http.send.mockImplementation()
    controller = new SignUpWithSocialAccountController(Broker)
  })

  it('should call the event broker to publish the user signed up event', async () => {
    const accountDto = AccountsFaker.fakeDto()
    http.getBody.mockResolvedValue(accountDto)

    await controller.handle(http)

    expect(Broker.publish).toHaveBeenCalledWith(
      new UserSignedUpEvent({
        userId: String(accountDto.id),
        userEmail: accountDto.email,
        userName: accountDto.name,
      }),
    )
    expect(http.send).toHaveBeenCalledWith({ isNewAccount: true })
  })
})
