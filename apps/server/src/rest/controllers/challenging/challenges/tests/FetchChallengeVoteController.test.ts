import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { GetChallengeVoteUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { FetchChallengeVoteController } from '../FetchChallengeVoteController'

describe('Fetch Challenge Vote Controller', () => {
  type Schema = {
    routeParams: {
      challengeId: string
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengesRepository>
  let controller: FetchChallengeVoteController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchChallengeVoteController(repository)
  })

  it('should fetch challenge vote with challenge and user ids', async () => {
    const challengeId = IdFaker.fake().value
    const userId = IdFaker.fake().value
    const challengeVote = { challengeVote: 'upvote' }
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ challengeId })
    http.getAccount.mockResolvedValue({ id: userId } as never)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(GetChallengeVoteUseCase.prototype, 'execute')
      .mockResolvedValue(challengeVote as never)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      challengeId,
      userId,
    })
    expect(http.send).toHaveBeenCalledWith(challengeVote)
    expect(response).toBe(restResponse)
  })
})
