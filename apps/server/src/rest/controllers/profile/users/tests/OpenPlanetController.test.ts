import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { OpenPlanetUseCase } from '@stardust/core/profile/use-cases'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { OpenPlanetController } from '../OpenPlanetController'

describe('Open Planet Controller', () => {
  type Schema = { routeParams: { planetId: string } }

  let http: Mock<Http<Schema>>
  let usersRepository: Mock<UsersRepository>
  let controller: OpenPlanetController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.send.mockImplementation()
    controller = new OpenPlanetController(usersRepository)
  })

  it('should open the planet for the session account and send the response', async () => {
    const userId = IdFaker.fake().value
    const planetId = IdFaker.fake().value
    http.getAccountId.mockResolvedValue(userId)
    http.getRouteParams.mockReturnValue({ planetId })
    const executeSpy = jest
      .spyOn(OpenPlanetUseCase.prototype, 'execute')
      .mockResolvedValue({ openedPlanetId: planetId })

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ userId, planetId })
    expect(http.send).toHaveBeenCalledWith({ openedPlanetId: planetId })
  })

  it('should propagate use case failures', async () => {
    http.getAccountId.mockResolvedValue(IdFaker.fake().value)
    http.getRouteParams.mockReturnValue({ planetId: IdFaker.fake().value })
    jest
      .spyOn(OpenPlanetUseCase.prototype, 'execute')
      .mockRejectedValue(new Error('boom'))

    await expect(controller.handle(http)).rejects.toThrow('boom')
    expect(http.send).not.toHaveBeenCalled()
  })
})
