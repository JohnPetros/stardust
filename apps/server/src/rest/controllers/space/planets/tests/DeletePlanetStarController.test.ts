import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { PlanetsRepository, StarsRepository } from '@stardust/core/space/interfaces'
import { DeletePlanetStarUseCase } from '@stardust/core/space/use-cases'

import { DeletePlanetStarController } from '../DeletePlanetStarController'

describe('Delete Planet Star Controller', () => {
  let http: Mock<Http<{ routeParams: { planetId: string; starId: string } }>>
  let planetsRepository: Mock<PlanetsRepository>
  let starsRepository: Mock<StarsRepository>
  let controller: DeletePlanetStarController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    planetsRepository = mock()
    starsRepository = mock()
    controller = new DeletePlanetStarController(planetsRepository, starsRepository)
  })

  it('should extract route params, execute use case and return no content', async () => {
    const planetId = IdFaker.fake().value
    const starId = IdFaker.fake().value
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ planetId, starId })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(DeletePlanetStarUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({ planetId, starId })
    expect(http.statusNoContent).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalled()
    expect(response).toBe(restResponse)
  })

  it('should propagate error when use case fails and avoid sending response', async () => {
    const planetId = IdFaker.fake().value
    const starId = IdFaker.fake().value
    const error = new Error('delete-failed')

    http.getRouteParams.mockReturnValue({ planetId, starId })

    jest.spyOn(DeletePlanetStarUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.statusNoContent).not.toHaveBeenCalled()
    expect(http.send).not.toHaveBeenCalled()
  })
})
