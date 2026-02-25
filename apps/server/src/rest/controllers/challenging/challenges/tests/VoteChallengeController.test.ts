import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { VoteChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { VoteChallengeController } from '../VoteChallengeController'

describe('Vote Challenge Controller', () => {
  type Schema = {
    routeParams: {
      challengeId: string
    }
    body: {
      challengeVote: string
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengesRepository>
  let controller: VoteChallengeController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new VoteChallengeController(repository)
  })

  it('should vote challenge with request route and body data', async () => {
    const challengeId = IdFaker.fake().value
    const userId = IdFaker.fake().value
    const challengeVote = 'upvote'
    const voteResponse = {
      upvotesCount: 8,
      downvotesCount: 2,
      userChallengeVote: challengeVote as 'upvote',
    }
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ challengeId })
    http.getBody.mockResolvedValue({ challengeVote })
    http.getAccount.mockResolvedValue({ id: userId } as never)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(VoteChallengeUseCase.prototype, 'execute')
      .mockResolvedValue(voteResponse as never)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      challengeId,
      challengeVote,
      userId,
    })
    expect(http.send).toHaveBeenCalledWith(voteResponse)
    expect(response).toBe(restResponse)
  })
})
