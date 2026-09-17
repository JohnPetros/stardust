import { mock, type Mock } from 'ts-jest-mocker'

import type { ListRoadmapNodeChallengesUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

import { ListRoadmapNodeChallengesController } from '../ListRoadmapNodeChallengesController'

describe('Fetch Roadmap Node Challenges Controller', () => {
  type Schema = {
    routeParams: { nodeKey: string }
    body: { userCompletedChallengesIds?: string[] }
  }
  let http: Mock<Http<Schema>>
  let useCase: Mock<ListRoadmapNodeChallengesUseCase>
  let controller: ListRoadmapNodeChallengesController

  beforeEach(() => {
    http = mock()
    useCase = mock()
    controller = new ListRoadmapNodeChallengesController(useCase)
  })

  it('passes the node key and profile completion ids to the use case', async () => {
    const completedChallengeIds = ['completed-id']
    const nodeChallenges = { nodeKey: 'basico', challenges: [] }
    const response = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ nodeKey: 'basico' })
    http.getBody.mockResolvedValue({ userCompletedChallengesIds: completedChallengeIds })
    http.send.mockReturnValue(response)
    useCase.execute.mockResolvedValue(nodeChallenges)

    await expect(controller.handle(http)).resolves.toBe(response)
    expect(useCase.execute).toHaveBeenCalledWith({
      nodeKey: 'basico',
      completedChallengeIds,
    })
    expect(http.send).toHaveBeenCalledWith(nodeChallenges)
  })
})
