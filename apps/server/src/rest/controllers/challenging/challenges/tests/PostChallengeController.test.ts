import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import type {
  ChallengeSourcesRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import { PostChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Broker, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

import { PostChallengeController } from '../PostChallengeController'

describe('Post Challenge Controller', () => {
  type Schema = {
    body: ReturnType<typeof ChallengesFaker.fakeDto>
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengesRepository>
  let challengeSourcesRepository: Mock<ChallengeSourcesRepository>
  let broker: Mock<Broker>
  let controller: PostChallengeController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    challengeSourcesRepository = mock()
    broker = mock()
    controller = new PostChallengeController(
      repository,
      challengeSourcesRepository,
      broker,
    )
  })

  it('should post challenge using body dto and send response', async () => {
    const challengeDto = ChallengesFaker.fakeDto()
    const responseDto = ChallengesFaker.fakeDto()
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue(challengeDto)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(PostChallengeUseCase.prototype, 'execute')
      .mockResolvedValue(responseDto)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      challengeDto,
      challengeSourceId: null,
    })
    expect(http.send).toHaveBeenCalledWith(responseDto)
    expect(response).toBe(restResponse)
  })
})
