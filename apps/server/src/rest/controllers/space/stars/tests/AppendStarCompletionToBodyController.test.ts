import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import type {
  GalaxiesRepository,
  PlanetsRepository,
  StarsRepository,
} from '@stardust/core/space/interfaces'
import { StarLockedError } from '@stardust/core/space/errors'
import { GetStarCompletionUseCase } from '@stardust/core/space/use-cases'

import { AppendStarCompletionToBodyController } from '../AppendStarCompletionToBodyController'

describe('Append Star Completion To Body Controller', () => {
  type Schema = {
    body: { starId: string; completedStarsIds: string[]; openedPlanetsIds: string[] }
  }

  let http: Mock<Http<Schema>>
  let controller: AppendStarCompletionToBodyController

  const body = {
    starId: IdFaker.fake().value,
    completedStarsIds: [IdFaker.fake().value],
    openedPlanetsIds: [IdFaker.fake().value],
  }

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    http.extendBody.mockImplementation()
    http.pass.mockImplementation()
    http.getBody.mockResolvedValue(body)
    controller = new AppendStarCompletionToBodyController(
      mock<StarsRepository>(),
      mock<PlanetsRepository>(),
      mock<GalaxiesRepository>(),
    )
  })

  it('should extend the body with the star completion and pass', async () => {
    const completion = {
      isLastGalaxyStar: false,
      isFirstGalaxy: true,
      isAlreadyCompleted: false,
      completedPlanetName: null,
    }
    const executeSpy = jest
      .spyOn(GetStarCompletionUseCase.prototype, 'execute')
      .mockResolvedValue(completion)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith(body)
    expect(http.extendBody).toHaveBeenCalledWith(completion)
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should propagate a locked star error without extending the body', async () => {
    jest
      .spyOn(GetStarCompletionUseCase.prototype, 'execute')
      .mockRejectedValue(new StarLockedError())

    await expect(controller.handle(http)).rejects.toThrow(StarLockedError)
    expect(http.extendBody).not.toHaveBeenCalled()
  })
})
