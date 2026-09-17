import { mock, type Mock } from 'ts-jest-mocker'

import type { GetChallengeRoadmapUseCase } from '@stardust/core/challenging/use-cases'
import { ChallengeRoadmapFaker } from '@stardust/core/challenging/structures/fakers'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

import { FetchChallengeRoadmapController } from '../FetchChallengeRoadmapController'

describe('Fetch Challenge Roadmap Controller', () => {
  type Schema = { body: { userCompletedChallengesIds?: string[] } }
  let http: Mock<Http<Schema>>
  let useCase: Mock<GetChallengeRoadmapUseCase>
  let controller: FetchChallengeRoadmapController

  beforeEach(() => {
    http = mock()
    useCase = mock()
    controller = new FetchChallengeRoadmapController(useCase)
  })

  it('passes profile completion ids and sends the snapshot', async () => {
    const completedChallengeIds = ['completed-id']
    const roadmap = ChallengeRoadmapFaker.fakeDto()
    const response = mock<RestResponse>()

    http.getBody.mockResolvedValue({ userCompletedChallengesIds: completedChallengeIds })
    http.send.mockReturnValue(response)
    useCase.execute.mockResolvedValue(roadmap)

    await expect(controller.handle(http)).resolves.toBe(response)
    expect(useCase.execute).toHaveBeenCalledWith({
      completedChallengeIds,
    })
    expect(http.send).toHaveBeenCalledWith(roadmap)
  })
})
