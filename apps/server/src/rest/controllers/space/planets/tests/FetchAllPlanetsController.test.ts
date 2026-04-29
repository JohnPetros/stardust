import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { PlanetsFaker } from '@stardust/core/space/entities/fakers'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'

import { FetchAllPlanetsController } from '../FetchAllPlanetsController'

describe('Fetch All Planets Controller', () => {
  let http: Mock<Http>
  let planetsRepository: Mock<PlanetsRepository>
  let controller: FetchAllPlanetsController

  beforeEach(() => {
    http = mock()
    planetsRepository = mock()
    controller = new FetchAllPlanetsController(planetsRepository)

    http.statusOk.mockReturnValue(http)
  })

  it('should fetch planets, map dto and return ok response', async () => {
    const planets = PlanetsFaker.fakeMany(3)
    const restResponse = mock<RestResponse>()

    planetsRepository.findAll.mockResolvedValue(planets)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(planetsRepository.findAll).toHaveBeenCalledTimes(1)
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(planets.map((planet) => planet.dto))
    expect(response).toBe(restResponse)
  })

  it('should propagate repository errors and avoid sending response', async () => {
    const error = new Error('failed-to-fetch-planets')

    planetsRepository.findAll.mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.statusOk).not.toHaveBeenCalled()
    expect(http.send).not.toHaveBeenCalled()
  })
})
