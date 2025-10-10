import { mock, type Mock } from 'ts-jest-mocker'
import type { Controller, EventBroker, Http } from '@stardust/core/global/interfaces'
import { SignUpWithSocialAccountController } from '../SignUpWithSocialAccountController'
import { AccountsFaker } from '@stardust/core/auth/entities/fakers'
import { UserSignedUpEvent } from '@stardust/core/auth/events'

describe('Sign Up With Social Account Controller', () => {
  let http: Mock<Http>
  let eventBroker: Mock<EventBroker>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    eventBroker = mock<EventBroker>()
    eventBroker.publish.mockImplementation()
    http.send.mockImplementation()
    controller = new SignUpWithSocialAccountController(eventBroker)
  })

  it('should call the event broker to publish the user signed up event', async () => {
    const accountDto = AccountsFaker.fakeDto()
    http.getBody.mockResolvedValue(accountDto)

    await controller.handle(http)

    expect(eventBroker.publish).toHaveBeenCalledWith(
      new UserSignedUpEvent({
        userId: String(accountDto.id),
        userEmail: accountDto.email,
        userName: accountDto.name,
      }),
    )
    expect(http.send).toHaveBeenCalledWith({ isNewAccount: true })
  })
})
