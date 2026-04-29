import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { PlanetsFaker } from '@stardust/core/space/entities/fakers'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import { ReorderPlanetsUseCase } from '@stardust/core/space/use-cases'

import { ReorderPlanetsController } from '../ReorderPlanetsController'

describe('Reorder Planets Controller', () => {
  type Schema = {
    body: {
      planetIds: string[]
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<PlanetsRepository>
  let broker: Mock<Broker>
  let controller: ReorderPlanetsController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    broker = mock()
    controller = new ReorderPlanetsController(repository, broker)
    http.statusOk.mockReturnValue(http)
  })

  it('should extract body, call use case and return ok response', async () => {
    const body = {
      planetIds: [IdFaker.fake().value, IdFaker.fake().value, IdFaker.fake().value],
    }
    const reorderedPlanets = [
      PlanetsFaker.fakeDto({ id: body.planetIds[0], position: 1 }),
    ]
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(ReorderPlanetsUseCase.prototype, 'execute')
      .mockResolvedValue(reorderedPlanets)

    const result = await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ planetIds: body.planetIds })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(reorderedPlanets)
    expect(result).toBe(restResponse)
  })

  it('should forward empty planetIds to use case', async () => {
    const body = { planetIds: [] }
    const reorderedPlanets: [] = []

    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(mock<RestResponse>())

    const executeSpy = jest
      .spyOn(ReorderPlanetsUseCase.prototype, 'execute')
      .mockResolvedValue(reorderedPlanets)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ planetIds: [] })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(reorderedPlanets)
  })
})
