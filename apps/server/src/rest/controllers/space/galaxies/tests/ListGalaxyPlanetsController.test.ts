import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { PlanetsFaker } from '@stardust/core/space/entities/fakers'
import type {
  GalaxiesRepository,
  PlanetsRepository,
} from '@stardust/core/space/interfaces'
import { ListGalaxyPlanetsUseCase } from '@stardust/core/space/use-cases'

import { ListGalaxyPlanetsController } from '../ListGalaxyPlanetsController'

describe('List Galaxy Planets Controller', () => {
  type Schema = {
    routeParams: {
      galaxySlug: string
    }
  }

  let http: Mock<Http<Schema>>
  let galaxiesRepository: Mock<GalaxiesRepository>
  let planetsRepository: Mock<PlanetsRepository>
  let controller: ListGalaxyPlanetsController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    galaxiesRepository = mock()
    planetsRepository = mock()
    controller = new ListGalaxyPlanetsController(galaxiesRepository, planetsRepository)
    http.statusOk.mockReturnValue(http)
  })

  it('should read the galaxy slug, call the use case and send ok response', async () => {
    const galaxySlug = 'logica-de-programacao'
    const planets = [PlanetsFaker.fakeDto(), PlanetsFaker.fakeDto()]
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ galaxySlug })
    http.send.mockReturnValue(restResponse)
    const executeSpy = jest
      .spyOn(ListGalaxyPlanetsUseCase.prototype, 'execute')
      .mockResolvedValue(planets)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ galaxySlug })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(planets)
    expect(response).toBe(restResponse)
  })

  it('should propagate use case errors without sending response', async () => {
    const error = new Error('Galaxy not found')

    http.getRouteParams.mockReturnValue({ galaxySlug: 'inexistente' })
    jest.spyOn(ListGalaxyPlanetsUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.send).not.toHaveBeenCalled()
  })
})
