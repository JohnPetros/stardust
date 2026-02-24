import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { GetChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { FetchChallengeController } from '../FetchChallengeController'

describe('Fetch Challenge Controller', () => {
  type Schema = {
    routeParams: {
      challengeSlug?: string
      challengeId?: string
      starId?: string
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengesRepository>
  let controller: FetchChallengeController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchChallengeController(repository)
  })

  it('should fetch challenge with route params and send response', async () => {
    const routeParams = {
      challengeId: IdFaker.fake().value,
      challengeSlug: 'sum-two-numbers',
      starId: IdFaker.fake().value,
    }
    const challengeDto = ChallengesFaker.fakeDto({ id: routeParams.challengeId })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue(routeParams)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(GetChallengeUseCase.prototype, 'execute')
      .mockResolvedValue(challengeDto)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith(routeParams)
    expect(http.send).toHaveBeenCalledWith(challengeDto)
    expect(response).toBe(restResponse)
  })
})
