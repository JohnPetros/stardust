import { mock, type Mock } from 'ts-jest-mocker'

import { PlanetsFaker } from '@stardust/core/space/entities/fakers'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import { UpdatePlanetUseCase } from '@stardust/core/space/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

import { UpdatePlanetController } from '../UpdatePlanetController'

describe('Update Planet Controller', () => {
  type Schema = {
    routeParams: {
      planetId: string
    }
    body: {
      name?: string
      icon?: string
      image?: string
    }
  }

  let http: Mock<Http<Schema>>
  let planetsRepository: Mock<PlanetsRepository>
  let controller: UpdatePlanetController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    planetsRepository = mock()
    controller = new UpdatePlanetController(planetsRepository)
    http.statusOk.mockReturnValue(http)
  })

  it('should read route params and body, call use case and send updated planet dto', async () => {
    const routeParams = {
      planetId: '550e8400-e29b-41d4-a716-446655440001',
    }
    const body = {
      name: 'Variaveis',
      icon: 'https://cdn.stardust.dev/space/planets/variables-icon.png',
      image: 'https://cdn.stardust.dev/space/planets/variables-cover.png',
    }
    const updatedPlanetDto = PlanetsFaker.fakeDto({
      id: routeParams.planetId,
      name: body.name,
      icon: body.icon,
      image: body.image,
    })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue(routeParams)
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(UpdatePlanetUseCase.prototype, 'execute')
      .mockResolvedValue(updatedPlanetDto)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      planetId: routeParams.planetId,
      name: body.name,
      icon: body.icon,
      image: body.image,
    })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(updatedPlanetDto)
    expect(response).toBe(restResponse)
  })

  it('should allow partial updates and keep undefined fields in use case input', async () => {
    const routeParams = {
      planetId: '550e8400-e29b-41d4-a716-446655440002',
    }
    const body = {
      name: 'Lacos',
    }
    const updatedPlanetDto = PlanetsFaker.fakeDto({
      id: routeParams.planetId,
      name: body.name,
    })

    http.getRouteParams.mockReturnValue(routeParams)
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(mock<RestResponse>())

    const executeSpy = jest
      .spyOn(UpdatePlanetUseCase.prototype, 'execute')
      .mockResolvedValue(updatedPlanetDto)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      planetId: routeParams.planetId,
      name: body.name,
      icon: undefined,
      image: undefined,
    })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(updatedPlanetDto)
  })
})
