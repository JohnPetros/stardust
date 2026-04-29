import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { CompleteSpaceUseCase } from '@stardust/core/profile/use-cases'

import { CompleteSpaceController } from '../CompleteSpaceController'

describe('Complete Space Controller', () => {
  type Schema = {
    body: {
      nextStarId: string | null
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<UsersRepository>
  let broker: Mock<Broker>
  let controller: CompleteSpaceController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    broker = mock()
    controller = new CompleteSpaceController(repository, broker)
  })

  it('should read account and body, execute use case and pass request', async () => {
    const userId = 'user-1'
    const body = { nextStarId: 'star-99' }
    const restResponse = mock<RestResponse>()

    http.getAccountId.mockResolvedValue(userId)
    http.getBody.mockResolvedValue(body)
    http.pass.mockResolvedValue(restResponse)

    const executeSpy = jest
      .spyOn(CompleteSpaceUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const response = await controller.handle(http)

    expect(http.getAccountId).toHaveBeenCalled()
    expect(http.getBody).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({
      userId,
      nextStarId: body.nextStarId,
    })
    expect(http.pass).toHaveBeenCalled()
    expect(response).toBe(restResponse)
  })
})
