import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { CompleteSpaceUseCase } from '@stardust/core/profile/use-cases'

import { CompleteSpaceController } from '../CompleteSpaceController'

describe('Complete Space Controller', () => {
  type Schema = {
    body: {
      isLastGalaxyStar: boolean
      isFirstGalaxy: boolean
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
    const body = { isLastGalaxyStar: true, isFirstGalaxy: true }
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
      isLastGalaxyStar: body.isLastGalaxyStar,
      isFirstGalaxy: body.isFirstGalaxy,
    })
    expect(http.pass).toHaveBeenCalled()
    expect(response).toBe(restResponse)
  })

  it('should forward a non-first galaxy and the last star flag to the use case', async () => {
    const userId = 'user-2'
    const body = { isLastGalaxyStar: true, isFirstGalaxy: false }

    http.getAccountId.mockResolvedValue(userId)
    http.getBody.mockResolvedValue(body)
    http.pass.mockResolvedValue(mock<RestResponse>())

    const executeSpy = jest
      .spyOn(CompleteSpaceUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      userId,
      isLastGalaxyStar: true,
      isFirstGalaxy: false,
    })
    expect(http.pass).toHaveBeenCalled()
  })
})
