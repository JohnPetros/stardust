import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker, Http } from '@stardust/core/global/interfaces'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { StarsFaker } from '@stardust/core/space/entities/fakers'
import type { PlanetsRepository, StarsRepository } from '@stardust/core/space/interfaces'
import { GetNextStarUseCase } from '@stardust/core/space/use-cases'

import { AppendNextStarToBodyController } from '../AppendNextStarToBodyController'

describe('Append Next Star To Body Controller', () => {
  type Schema = {
    body: {
      starId: string
      userName: string
      userSlug: string
    }
  }

  let http: Mock<Http<Schema>>
  let starsRepository: Mock<StarsRepository>
  let planetsRepository: Mock<PlanetsRepository>
  let broker: Mock<Broker>
  let controller: AppendNextStarToBodyController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    starsRepository = mock()
    planetsRepository = mock()
    broker = mock()
    http.extendBody.mockImplementation()
    http.pass.mockImplementation()
    controller = new AppendNextStarToBodyController(
      starsRepository,
      planetsRepository,
      broker,
    )
  })

  it('should get body, call use case, append nextStarId and call pass', async () => {
    const body = {
      starId: IdFaker.fake().value,
      userName: 'petros',
      userSlug: 'petros-dev',
    }
    const nextStar = StarsFaker.fakeDto()

    http.getBody.mockResolvedValue(body)
    const executeSpy = jest
      .spyOn(GetNextStarUseCase.prototype, 'execute')
      .mockResolvedValue(nextStar)

    await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      currentStarId: body.starId,
      userName: body.userName,
      userSlug: body.userSlug,
    })
    expect(http.extendBody).toHaveBeenCalledWith({ nextStarId: nextStar.id })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should append null nextStarId when use case returns null', async () => {
    const body = {
      starId: IdFaker.fake().value,
      userName: 'ana',
      userSlug: 'ana-codes',
    }

    http.getBody.mockResolvedValue(body)
    const executeSpy = jest
      .spyOn(GetNextStarUseCase.prototype, 'execute')
      .mockResolvedValue(null)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      currentStarId: body.starId,
      userName: body.userName,
      userSlug: body.userSlug,
    })
    expect(http.extendBody).toHaveBeenCalledWith({ nextStarId: null })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })
})
