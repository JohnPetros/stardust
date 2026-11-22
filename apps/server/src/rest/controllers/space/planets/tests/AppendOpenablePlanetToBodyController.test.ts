import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import { PlanetLockedError } from '@stardust/core/space/errors'
import { GetPlanetOpeningUseCase } from '@stardust/core/space/use-cases'

import { AppendOpenablePlanetToBodyController } from '../AppendOpenablePlanetToBodyController'

describe('Append Openable Planet To Body Controller', () => {
  type Schema = {
    routeParams: { planetId: string }
    body: { completedStarsIds: string[]; openedPlanetsIds: string[] }
  }

  let http: Mock<Http<Schema>>
  let planetsRepository: Mock<PlanetsRepository>
  let controller: AppendOpenablePlanetToBodyController

  const planetId = IdFaker.fake().value
  const body = { completedStarsIds: [IdFaker.fake().value], openedPlanetsIds: [] }

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    planetsRepository = mock()
    http.extendBody.mockImplementation()
    http.pass.mockImplementation()
    http.getRouteParams.mockReturnValue({ planetId })
    http.getBody.mockResolvedValue(body)
    controller = new AppendOpenablePlanetToBodyController(planetsRepository)
  })

  it('should extend the body with the planet opening and pass', async () => {
    const opening = { planetId, isAlreadyOpened: false }
    const executeSpy = jest
      .spyOn(GetPlanetOpeningUseCase.prototype, 'execute')
      .mockResolvedValue(opening)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ planetId, ...body })
    expect(http.extendBody).toHaveBeenCalledWith(opening)
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should propagate a locked planet error without extending the body', async () => {
    jest
      .spyOn(GetPlanetOpeningUseCase.prototype, 'execute')
      .mockRejectedValue(new PlanetLockedError())

    await expect(controller.handle(http)).rejects.toThrow(PlanetLockedError)
    expect(http.extendBody).not.toHaveBeenCalled()
  })
})
