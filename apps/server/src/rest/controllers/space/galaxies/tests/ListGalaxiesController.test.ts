import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { GalaxySummaryDto } from '@stardust/core/space/entities/dtos'
import type { GalaxiesRepository } from '@stardust/core/space/interfaces'
import { ListGalaxiesUseCase } from '@stardust/core/space/use-cases'

import { ListGalaxiesController } from '../ListGalaxiesController'

describe('List Galaxies Controller', () => {
  type Schema = {
    body: {
      currentGalaxyId: string | null
      completedPlanetsIds: string[]
    }
  }

  let http: Mock<Http<Schema>>
  let galaxiesRepository: Mock<GalaxiesRepository>
  let controller: ListGalaxiesController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    galaxiesRepository = mock()
    controller = new ListGalaxiesController(galaxiesRepository)
    http.statusOk.mockReturnValue(http)
  })

  it('should forward the body to the use case and send ok response', async () => {
    const body = {
      currentGalaxyId: IdFaker.fake().value,
      completedPlanetsIds: [IdFaker.fake().value, IdFaker.fake().value],
    }
    const galaxies: GalaxySummaryDto[] = [
      {
        id: body.currentGalaxyId,
        slug: 'logica-de-programacao',
        name: 'Lógica de Programação',
        description: 'Aprenda a pensar como um programador',
        animation: 'logica.json',
        position: 1,
        status: 'published',
        planetsCount: 10,
        completedPlanetsCount: 2,
        isCurrent: true,
      },
    ]
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)
    const executeSpy = jest
      .spyOn(ListGalaxiesUseCase.prototype, 'execute')
      .mockResolvedValue(galaxies)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      currentGalaxyId: body.currentGalaxyId,
      completedPlanetsIds: body.completedPlanetsIds,
    })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(galaxies)
    expect(response).toBe(restResponse)
  })

  it('should forward a null current galaxy id', async () => {
    const body = { currentGalaxyId: null, completedPlanetsIds: [] }

    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(mock<RestResponse>())
    const executeSpy = jest
      .spyOn(ListGalaxiesUseCase.prototype, 'execute')
      .mockResolvedValue([])

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      currentGalaxyId: null,
      completedPlanetsIds: [],
    })
    expect(http.send).toHaveBeenCalledWith([])
  })

  it('should propagate use case errors without sending response', async () => {
    const error = new Error('Could not list galaxies')

    http.getBody.mockResolvedValue({ currentGalaxyId: null, completedPlanetsIds: [] })
    jest.spyOn(ListGalaxiesUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.send).not.toHaveBeenCalled()
  })
})
