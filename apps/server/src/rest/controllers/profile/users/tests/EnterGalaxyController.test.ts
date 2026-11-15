import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import { GalaxyAggregatesFaker } from '@stardust/core/profile/aggregates/fakers'
import type { GalaxyAggregateDto } from '@stardust/core/profile/aggregates/dtos'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { EnterGalaxyUseCase } from '@stardust/core/profile/use-cases'

import { EnterGalaxyController } from '../EnterGalaxyController'

describe('Enter Galaxy Controller', () => {
  type Schema = {
    body: {
      galaxy: GalaxyAggregateDto
    }
  }

  let http: Mock<Http<Schema>>
  let usersRepository: Mock<UsersRepository>
  let controller: EnterGalaxyController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    controller = new EnterGalaxyController(usersRepository)
    http.statusOk.mockReturnValue(http)
  })

  it('should enter the galaxy for the session account and send the current galaxy', async () => {
    const userId = IdFaker.fake().value
    const galaxy = GalaxyAggregatesFaker.fakeDto()
    const restResponse = mock<RestResponse>()

    http.getAccountId.mockResolvedValue(userId)
    http.getBody.mockResolvedValue({ galaxy })
    http.send.mockReturnValue(restResponse)
    const executeSpy = jest
      .spyOn(EnterGalaxyUseCase.prototype, 'execute')
      .mockResolvedValue(UsersFaker.fakeDto())

    const response = await controller.handle(http)

    expect(http.getAccountId).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ userId, galaxy })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith({
      currentGalaxy: {
        id: galaxy.id,
        slug: galaxy.entity?.slug,
        name: galaxy.entity?.name,
      },
    })
    expect(response).toBe(restResponse)
  })

  it('should propagate use case errors without sending response', async () => {
    const error = new Error('User not found')

    http.getAccountId.mockResolvedValue(IdFaker.fake().value)
    http.getBody.mockResolvedValue({ galaxy: GalaxyAggregatesFaker.fakeDto() })
    jest.spyOn(EnterGalaxyUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.send).not.toHaveBeenCalled()
  })
})
