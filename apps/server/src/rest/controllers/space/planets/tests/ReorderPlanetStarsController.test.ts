import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { PlanetsRepository, StarsRepository } from '@stardust/core/space/interfaces'
import { ReorderPlanetStarsUseCase } from '@stardust/core/space/use-cases'

import { ReorderPlanetStarsController } from '../ReorderPlanetStarsController'

describe('Reorder Planet Stars Controller', () => {
  type Schema = {
    routeParams: {
      planetId: string
    }
    body: {
      starIds: string[]
    }
  }

  let http: Mock<Http<Schema>>
  let planetsRepository: Mock<PlanetsRepository>
  let starsRepository: Mock<StarsRepository>
  let broker: Mock<Broker>
  let controller: ReorderPlanetStarsController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    planetsRepository = mock()
    starsRepository = mock()
    broker = mock()
    controller = new ReorderPlanetStarsController(
      planetsRepository,
      starsRepository,
      broker,
    )
    http.statusOk.mockReturnValue(http)
  })

  it('should extract route params and body, execute use case and return ok', async () => {
    const planetId = IdFaker.fake().value
    const starIds = [IdFaker.fake().value, IdFaker.fake().value, IdFaker.fake().value]
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ planetId })
    http.getBody.mockResolvedValue({ starIds })
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(ReorderPlanetStarsUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ planetId, starIds })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(undefined)
    expect(response).toBe(restResponse)
  })

  it('should forward empty starIds to use case', async () => {
    const planetId = IdFaker.fake().value

    http.getRouteParams.mockReturnValue({ planetId })
    http.getBody.mockResolvedValue({ starIds: [] })
    http.send.mockReturnValue(mock<RestResponse>())

    const executeSpy = jest
      .spyOn(ReorderPlanetStarsUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ planetId, starIds: [] })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(undefined)
  })

  it('should propagate error when use case fails and avoid sending response', async () => {
    const planetId = IdFaker.fake().value
    const starIds = [IdFaker.fake().value]
    const error = new Error('reorder-stars-failed')

    http.getRouteParams.mockReturnValue({ planetId })
    http.getBody.mockResolvedValue({ starIds })

    jest.spyOn(ReorderPlanetStarsUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.statusOk).not.toHaveBeenCalled()
    expect(http.send).not.toHaveBeenCalled()
  })
})
