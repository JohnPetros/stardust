import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { PlanetsFaker } from '@stardust/core/space/entities/fakers'
import type {
  GalaxiesRepository,
  PlanetsRepository,
} from '@stardust/core/space/interfaces'
import { CreatePlanetUseCase } from '@stardust/core/space/use-cases'

import { CreatePlanetController } from '../CreatePlanetController'

describe('Create Planet Controller', () => {
  type Schema = {
    body: {
      name: string
      image: string
    }
  }

  let http: Mock<Http<Schema>>
  let planetsRepository: Mock<PlanetsRepository>
  let galaxiesRepository: Mock<GalaxiesRepository>
  let controller: CreatePlanetController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    planetsRepository = mock()
    galaxiesRepository = mock()
    controller = new CreatePlanetController(planetsRepository, galaxiesRepository)
  })

  it('should read body, call use case and send created planet', async () => {
    const body = {
      name: 'Variaveis',
      image: 'https://cdn.stardust.dev/planets/variables.png',
    }
    const createdPlanetDto = PlanetsFaker.fakeDto({
      name: body.name,
      image: body.image,
    })
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue(body)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(CreatePlanetUseCase.prototype, 'execute')
      .mockResolvedValue(createdPlanetDto)

    const response = await controller.handle(http)

    expect(http.getBody).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({
      name: body.name,
      image: body.image,
    })
    expect(http.statusCreated).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(createdPlanetDto)
    expect(response).toBe(restResponse)
  })

  it('should propagate use case errors without sending response', async () => {
    const body = {
      name: 'Lacos',
      image: 'https://cdn.stardust.dev/planets/loops.png',
    }
    const error = new Error('Planet already exists')

    http.getBody.mockResolvedValue(body)

    jest.spyOn(CreatePlanetUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)
    expect(http.statusCreated).not.toHaveBeenCalled()
    expect(http.send).not.toHaveBeenCalled()
  })
})
