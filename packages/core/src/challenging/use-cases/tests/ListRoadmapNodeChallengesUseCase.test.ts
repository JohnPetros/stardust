import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '#challenging/domain/entities/fakers/index'
import { ChallengeRoadmapFaker } from '#challenging/domain/structures/fakers/index'
import { ChallengeRoadmapNotFoundError } from '#challenging/domain/errors/index'
import type { ChallengeRoadmapsRepository } from '#challenging/interfaces/ChallengeRoadmapsRepository'
import { ListRoadmapNodeChallengesUseCase } from '../ListRoadmapNodeChallengesUseCase'

const firstChallengeId = '00000000-0000-4000-8000-000000000001'
const secondChallengeId = '00000000-0000-4000-8000-000000000002'

describe('ListRoadmapNodeChallengesUseCase', () => {
  let repository: Mock<ChallengeRoadmapsRepository>
  let useCase: ListRoadmapNodeChallengesUseCase

  beforeEach(() => {
    repository = mock<ChallengeRoadmapsRepository>()
    repository.findPublished.mockImplementation()
    repository.findNodeChallenges.mockImplementation()
    useCase = new ListRoadmapNodeChallengesUseCase(repository)
  })

  it('rejects a missing roadmap or node before querying challenges', async () => {
    repository.findPublished.mockResolvedValue(null)
    await expect(useCase.execute({ nodeKey: 'basico' })).rejects.toThrow(
      ChallengeRoadmapNotFoundError,
    )
    expect(repository.findNodeChallenges).not.toHaveBeenCalled()
  })

  it('returns only curated challenges in editorial order with completion state', async () => {
    const roadmap = ChallengeRoadmapFaker.fake(
      ChallengeRoadmapFaker.fakeDto({
        nodes: [
          {
            key: 'basico',
            category: { name: 'Básico' },
            position: { x: 0, y: 0 },
            recommendationOrder: 1,
            state: 'content',
            challengeIds: [firstChallengeId, secondChallengeId],
            totalChallenges: 2,
            completedChallenges: null,
            isCompleted: null,
            isEligible: null,
            challengeSlugs: ['primeiro', 'segundo'],
          },
        ],
        edges: [],
      }),
    )
    const first = ChallengesFaker.fake({ id: firstChallengeId, title: 'First challenge' })
    const second = ChallengesFaker.fake({
      id: secondChallengeId,
      title: 'Second challenge',
    })
    repository.findPublished.mockResolvedValue(roadmap)
    repository.findNodeChallenges.mockResolvedValue([second, first])

    const response = await useCase.execute({
      nodeKey: 'basico',
      completedChallengeIds: [firstChallengeId],
    })

    expect(response.nodeKey).toBe('basico')
    expect(response.challenges.map((challenge) => challenge.id)).toEqual([
      firstChallengeId,
      secondChallengeId,
    ])
    expect(response.challenges.map((challenge) => challenge.order)).toEqual([1, 2])
    expect(response.challenges.map((challenge) => challenge.isCompleted)).toEqual([
      true,
      false,
    ])
    expect(repository.findNodeChallenges).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'basico' }),
    )
  })

  it('returns null completion for visitors', async () => {
    const roadmap = ChallengeRoadmapFaker.fake()
    const node = roadmap.nodes[0]
    const challenge = ChallengesFaker.fake({ id: node.challengeIds.ids[0].value })
    repository.findPublished.mockResolvedValue(roadmap)
    repository.findNodeChallenges.mockResolvedValue([challenge])

    const response = await useCase.execute({ nodeKey: node.key.value })

    expect(response.challenges[0].isCompleted).toBeNull()
  })
})
