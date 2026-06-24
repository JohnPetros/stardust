import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Broker, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { RestResponse } from '@stardust/core/global/responses'
import { AccountsFaker } from '@stardust/core/auth/entities/fakers'
import { AccountSignedUpEvent } from '@stardust/core/auth/events'
import { AppError } from '@stardust/core/global/errors'

import { RetryUserCreationController } from '../RetryUserCreationController'

describe('Retry User Creation Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let broker: Mock<Broker>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    broker = mock<Broker>()
    broker.publish.mockImplementation()
    controller = new RetryUserCreationController(service, broker)
  })

  it('should publish AccountSignedUpEvent with account data', async () => {
    const accountDto = AccountsFaker.fakeDto({
      id: 'account-id',
      email: 'user@test.com',
      name: 'Test User',
    })
    service.fetchAccount.mockResolvedValue(new RestResponse({ body: accountDto }))

    await controller.handle(http)

    expect(broker.publish).toHaveBeenCalledWith(
      new AccountSignedUpEvent({
        accountId: 'account-id',
        accountEmail: 'user@test.com',
        accountName: 'Test User',
      }),
    )
  })

  it('should use email local-part as fallback when account name is empty', async () => {
    const accountDto = AccountsFaker.fakeDto({
      id: 'account-id',
      email: 'john@test.com',
      name: '',
    })
    service.fetchAccount.mockResolvedValue(new RestResponse({ body: accountDto }))

    await controller.handle(http)

    expect(broker.publish).toHaveBeenCalledWith(
      new AccountSignedUpEvent({
        accountId: 'account-id',
        accountEmail: 'john@test.com',
        accountName: 'john',
      }),
    )
  })

  it('should propagate error when fetchAccount fails without publishing', async () => {
    const errorResponse = new RestResponse<AccountDto>({
      errorMessage: 'Unauthorized',
      statusCode: 401,
    })
    service.fetchAccount.mockResolvedValue(errorResponse)

    await expect(controller.handle(http)).rejects.toThrow()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should throw when account id is missing', async () => {
    const accountDto = AccountsFaker.fakeDto({
      id: '',
      email: 'user@test.com',
      name: 'Test User',
    })
    service.fetchAccount.mockResolvedValue(new RestResponse({ body: accountDto }))

    await expect(controller.handle(http)).rejects.toThrow(AppError)
    expect(broker.publish).not.toHaveBeenCalled()
  })
})
