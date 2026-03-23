import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengeNavigation } from '@stardust/core/challenging/structures'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { GetChallengeNavigationUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

import { FetchChallengeNavigationController } from '../FetchChallengeNavigationController'

describe('Fetch Challenge Navigation Controller', () => {
  type Schema = {
    routeParams: {
      challengeSlug: string
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengesRepository>
  let controller: FetchChallengeNavigationController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchChallengeNavigationController(repository)
  })

  it('should fetch challenge navigation with route params and send response', async () => {
    const routeParams = {
      challengeSlug: 'sum-two-numbers',
    }
    const challengeNavigationDto = ChallengeNavigation.create({
      previousChallengeSlug: 'variables-introduction',
      nextChallengeSlug: 'sum-three-numbers',
    }).dto
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue(routeParams)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(GetChallengeNavigationUseCase.prototype, 'execute')
      .mockResolvedValue(challengeNavigationDto)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith(routeParams)
    expect(http.send).toHaveBeenCalledWith(challengeNavigationDto)
    expect(response).toBe(restResponse)
  })
})
