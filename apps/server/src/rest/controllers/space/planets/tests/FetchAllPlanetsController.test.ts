import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { GalaxiesFaker, PlanetsFaker } from '@stardust/core/space/entities/fakers'
import type {
  GalaxiesRepository,
  PlanetsRepository,
} from '@stardust/core/space/interfaces'

import { FetchAllPlanetsController } from '../FetchAllPlanetsController'

describe('Fetch All Planets Controller', () => {
  let http: Mock<Http>
  let planetsRepository: Mock<PlanetsRepository>
  let galaxiesRepository: Mock<GalaxiesRepository>
  let controller: FetchAllPlanetsController

  beforeEach(() => {
    http = mock()
    planetsRepository = mock()
    galaxiesRepository = mock()
    controller = new FetchAllPlanetsController(planetsRepository, galaxiesRepository)

    http.statusOk.mockReturnValue(http)
  })

  it('should fetch the planets of the first galaxy, map dto and return ok response', async () => {
    const galaxy = GalaxiesFaker.fake()
    const planets = PlanetsFaker.fakeMany(3)
    const restResponse = mock<RestResponse>()

    galaxiesRepository.findFirst.mockResolvedValue(galaxy)
    planetsRepository.findAllByGalaxy.mockResolvedValue(planets)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(galaxiesRepository.findFirst).toHaveBeenCalledTimes(1)
    expect(planetsRepository.findAllByGalaxy).toHaveBeenCalledWith(galaxy.id)
    expect(planetsRepository.findAll).not.toHaveBeenCalled()
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(planets.map((planet) => planet.dto))
    expect(response).toBe(restResponse)
  })

  it('should return an empty list when there is no first galaxy', async () => {
    const restResponse = mock<RestResponse>()

    galaxiesRepository.findFirst.mockResolvedValue(null)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(planetsRepository.findAllByGalaxy).not.toHaveBeenCalled()
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith([])
    expect(response).toBe(restResponse)
  })

  it('should propagate repository errors and avoid sending response', async () => {
    const error = new Error('failed-to-fetch-planets')

    galaxiesRepository.findFirst.mockResolvedValue(GalaxiesFaker.fake())
    planetsRepository.findAllByGalaxy.mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.statusOk).not.toHaveBeenCalled()
    expect(http.send).not.toHaveBeenCalled()
  })
})
