import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { StarsFaker } from '@stardust/core/space/entities/fakers'
import type { PlanetsRepository, StarsRepository } from '@stardust/core/space/interfaces'
import { CreatePlanetStarUseCase } from '@stardust/core/space/use-cases'

import { CreatePlanetStarController } from '../CreatePlanetStarController'

describe('Create Planet Star Controller', () => {
  type Schema = {
    routeParams: {
      planetId: string
    }
  }

  let http: Mock<Http<Schema>>
  let planetsRepository: Mock<PlanetsRepository>
  let starsRepository: Mock<StarsRepository>
  let controller: CreatePlanetStarController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    planetsRepository = mock()
    starsRepository = mock()
    controller = new CreatePlanetStarController(planetsRepository, starsRepository)
  })

  it('should extract route params, execute use case and send created star', async () => {
    const planetId = IdFaker.fake().value
    const createdStarDto = StarsFaker.fakeDto()
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ planetId })
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(CreatePlanetStarUseCase.prototype, 'execute')
      .mockResolvedValue(createdStarDto)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({ planetId })
    expect(http.statusCreated).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(createdStarDto)
    expect(response).toBe(restResponse)
  })

  it('should propagate error when use case fails and avoid sending response', async () => {
    const planetId = IdFaker.fake().value
    const error = new Error('create-star-failed')

    http.getRouteParams.mockReturnValue({ planetId })

    jest.spyOn(CreatePlanetStarUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.statusCreated).not.toHaveBeenCalled()
    expect(http.send).not.toHaveBeenCalled()
  })
})
