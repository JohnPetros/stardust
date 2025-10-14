import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, EventBroker, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { AccountsFaker } from '@stardust/core/auth/entities/fakers'
import { UserSignedUpEvent } from '@stardust/core/auth/events'
import { Password } from '@stardust/core/auth/structures'
import { Email } from '@stardust/core/global/structures'

import { SignUpController } from '../SignUpController'

describe('Sign Up Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let eventBroker: Mock<EventBroker>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    eventBroker = mock<EventBroker>()
    eventBroker.publish.mockImplementation()
    controller = new SignUpController(service, eventBroker)
  })

  it('should call the auth service to sign up', async () => {
    const restResponse = new RestResponse({ body: AccountsFaker.fakeDto() })
    const email = 'test@test.com'
    const password = 'password'
    const name = 'test name'
    service.signUp.mockResolvedValue(restResponse)
    http.getBody.mockResolvedValue({
      email,
      password,
      name,
    })
    const response = await controller.handle(http)

    expect(service.signUp).toHaveBeenCalledWith(
      Email.create(email),
      Password.create(password),
    )
    expect(response).toEqual(restResponse)
  })

  it('should call the event broker to publish the user signed up event', async () => {
    const restResponse = new RestResponse({ body: AccountsFaker.fakeDto() })
    const email = 'test@test.com'
    const name = 'test name'
    const password = 'password'
    service.signUp.mockResolvedValue(restResponse)
    http.getBody.mockResolvedValue({
      email,
      password,
      name,
    })
    await controller.handle(http)

    expect(eventBroker.publish).toHaveBeenCalledWith(
      new UserSignedUpEvent({
        userId: String(restResponse.body.id),
        userEmail: email,
        userName: name,
      }),
    )
  })
})
