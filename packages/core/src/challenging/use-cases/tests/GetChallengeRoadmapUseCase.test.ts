import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengeRoadmapFaker } from '#challenging/domain/structures/fakers/index'
import { ChallengeRoadmapNotFoundError } from '#challenging/domain/errors/index'
import type { ChallengeRoadmapsRepository } from '#challenging/interfaces/ChallengeRoadmapsRepository'
import { GetChallengeRoadmapUseCase } from '../GetChallengeRoadmapUseCase'

describe('GetChallengeRoadmapUseCase', () => {
  let repository: Mock<ChallengeRoadmapsRepository>
  let useCase: GetChallengeRoadmapUseCase

  beforeEach(() => {
    repository = mock<ChallengeRoadmapsRepository>()
    repository.findPublished.mockImplementation()
    useCase = new GetChallengeRoadmapUseCase(repository)
  })

  it('throws when there is no published roadmap', async () => {
    repository.findPublished.mockResolvedValue(null)

    await expect(useCase.execute({})).rejects.toThrow(ChallengeRoadmapNotFoundError)
  })

  it('returns a visitor snapshot without personal progress', async () => {
    const roadmap = ChallengeRoadmapFaker.fake()
    repository.findPublished.mockResolvedValue(roadmap)

    const response = await useCase.execute({})

    expect(response.progress).toBeNull()
    expect(response.nodes.every((node) => node.completedChallenges === null)).toBe(true)
  })

  it('passes server-resolved completed ids to the domain', async () => {
    const roadmap = ChallengeRoadmapFaker.fake()
    const challengeId = roadmap.nodes[0].challengeIds.ids[0].value
    repository.findPublished.mockResolvedValue(roadmap)

    const response = await useCase.execute({
      completedChallengeIds: [challengeId, challengeId],
    })

    expect(response.progress?.completed).toBe(1)
    expect(response.nodes[0].completedChallenges).toBe(1)
  })
})
