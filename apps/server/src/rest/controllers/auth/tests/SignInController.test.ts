import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { Broker } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { AccountSignedInEvent } from '@stardust/core/auth/events'
import { Email } from '@stardust/core/global/structures'
import { Password } from '@stardust/core/auth/structures'
import { SessionFaker } from '@stardust/core/auth/structures/fakers'

import { SignInController } from '../SignInController'

describe('Sign In Controller', () => {
  let broker: Mock<Broker>
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    broker = mock<Broker>()
    broker.publish.mockImplementation()
    http = mock()
    service = mock<AuthService>()
    controller = new SignInController(service, broker)
  })

  it('should call the auth service with the correct email and password', async () => {
    const email = Email.create('test@test.com')
    const password = Password.create('password')
    const restResponse = new RestResponse({ body: SessionFaker.fakeDto() })
    http.getBody.mockResolvedValue({ email: email.value, password: password.value })
    service.signIn.mockResolvedValue(restResponse)

    const response = await controller.handle(http)

    expect(service.signIn).toHaveBeenCalledWith(email, password)
    expect(broker.publish).toHaveBeenCalledWith(
      new AccountSignedInEvent({
        accountId: restResponse.body.account.id as string,
        platform: 'web',
      }),
    )
    expect(response).toEqual(restResponse)
  })
})
