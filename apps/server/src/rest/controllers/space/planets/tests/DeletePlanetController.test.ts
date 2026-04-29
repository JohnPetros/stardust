import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import { DeletePlanetUseCase } from '@stardust/core/space/use-cases'

import { DeletePlanetController } from '../DeletePlanetController'

describe('Delete Planet Controller', () => {
  let http: Mock<Http<{ routeParams: { planetId: string } }>>
  let repository: Mock<PlanetsRepository>
  let controller: DeletePlanetController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new DeletePlanetController(repository)
  })

  it('should extract route params, execute use case and return no content', async () => {
    const planetId = IdFaker.fake().value
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ planetId })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(DeletePlanetUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({ planetId })
    expect(http.statusNoContent).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalled()
    expect(response).toBe(restResponse)
  })

  it('should propagate error when use case fails and avoid sending response', async () => {
    const planetId = IdFaker.fake().value
    const error = new Error('delete-failed')

    http.getRouteParams.mockReturnValue({ planetId })

    jest.spyOn(DeletePlanetUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.statusNoContent).not.toHaveBeenCalled()
    expect(http.send).not.toHaveBeenCalled()
  })
})
