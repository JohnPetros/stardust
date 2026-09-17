import { ChallengeRoadmapFaker } from '../fakers'
import type { ChallengeRoadmapDto, RoadmapNodeDto } from '../dtos'

const id = (value: string) => `00000000-0000-4000-8000-${value.padStart(12, '0')}`

function node(
  key: string,
  recommendationOrder: number,
  challengeIds: string[],
  state: RoadmapNodeDto['state'] = 'content',
): RoadmapNodeDto {
  return {
    key,
    category: { id: id(`${recommendationOrder}1`), name: key },
    position: { x: recommendationOrder * 10, y: 20 },
    recommendationOrder,
    state,
    challengeIds,
    totalChallenges: challengeIds.length,
    completedChallenges: null,
    isCompleted: null,
    isEligible: null,
    challengeSlugs: challengeIds.map((_, index) => `${key}-challenge-${index + 1}`),
  }
}

function withoutChallengeSlugs(nodeDto: RoadmapNodeDto): RoadmapNodeDto {
  const copy = { ...nodeDto }
  delete copy.challengeSlugs
  return copy
}

function roadmapDto(overrides: Partial<ChallengeRoadmapDto> = {}): ChallengeRoadmapDto {
  return ChallengeRoadmapFaker.fakeDto({
    nodes: [node('basico', 1, [id('1')]), node('textos', 2, [id('2')])],
    edges: [{ prerequisiteNodeKey: 'basico', dependentNodeKey: 'textos' }],
    ...overrides,
  })
}

describe('ChallengeRoadmap', () => {
  it('returns the public snapshot without personal progress', () => {
    const roadmap = ChallengeRoadmapFaker.fake(roadmapDto())

    const snapshot = roadmap.toDto()

    expect(snapshot.nodes).toEqual([
      expect.objectContaining({
        key: 'basico',
        totalChallenges: 1,
        completedChallenges: null,
        isCompleted: null,
        isEligible: null,
      }),
      expect.objectContaining({ key: 'textos', totalChallenges: 1 }),
    ])
    expect(snapshot.progress).toBeNull()
    expect(snapshot.recommendation).toBeNull()
  })

  it('derives progress, eligibility and the first recommendation deterministically', () => {
    const roadmap = ChallengeRoadmapFaker.fake(roadmapDto())

    const snapshot = roadmap.toDto([id('1')])

    expect(snapshot.progress).toEqual({ completed: 1, total: 2, percentage: 50 })
    expect(snapshot.nodes[0]).toEqual(
      expect.objectContaining({
        completedChallenges: 1,
        isCompleted: true,
        isEligible: true,
      }),
    )
    expect(snapshot.nodes[1]).toEqual(
      expect.objectContaining({
        completedChallenges: 0,
        isCompleted: false,
        isEligible: true,
      }),
    )
    expect(snapshot.recommendation).toEqual({
      nodeKey: 'textos',
      challengeId: id('2'),
      challengeSlug: 'textos-challenge-1',
    })
  })

  it.each([
    [
      'duplicate node keys',
      roadmapDto({ nodes: [node('basico', 1, [id('1')]), node('basico', 2, [id('2')])] }),
    ],
    [
      'duplicate recommendation order',
      roadmapDto({ nodes: [node('basico', 1, [id('1')]), node('textos', 1, [id('2')])] }),
    ],
    [
      'duplicate challenge ids',
      roadmapDto({ nodes: [node('basico', 1, [id('1')]), node('textos', 2, [id('1')])] }),
    ],
    [
      'unknown edge node',
      roadmapDto({
        edges: [{ prerequisiteNodeKey: 'basico', dependentNodeKey: 'ausente' }],
      }),
    ],
    [
      'self edge',
      roadmapDto({
        edges: [{ prerequisiteNodeKey: 'basico', dependentNodeKey: 'basico' }],
      }),
    ],
    [
      'cycle',
      roadmapDto({
        nodes: [node('basico', 1, [id('1')]), node('textos', 2, [id('2')])],
        edges: [
          { prerequisiteNodeKey: 'basico', dependentNodeKey: 'textos' },
          { prerequisiteNodeKey: 'textos', dependentNodeKey: 'basico' },
        ],
      }),
    ],
    [
      'coming soon with a dependent',
      roadmapDto({
        nodes: [node('basico', 1, [], 'comingSoon'), node('textos', 2, [id('2')])],
        edges: [{ prerequisiteNodeKey: 'basico', dependentNodeKey: 'textos' }],
      }),
    ],
  ])('rejects %s', (_, invalidDto) => {
    expect(() => ChallengeRoadmapFaker.fake(invalidDto)).toThrow('integridade')
  })

  it.each([
    ['missing', withoutChallengeSlugs(node('basico', 1, [id('1')]))],
    ['invalid', { ...node('basico', 1, [id('1')]), challengeSlugs: ['invalid/path'] }],
  ])('rejects %s challenge slug metadata', (_, invalidNode) => {
    expect(() =>
      ChallengeRoadmapFaker.fake(roadmapDto({ nodes: [invalidNode] })),
    ).toThrow('integridade')
  })

  it('accepts an empty comingSoon node only as a terminal node', () => {
    const roadmap = ChallengeRoadmapFaker.fake(
      roadmapDto({
        nodes: [node('basico', 1, [id('1')]), node('lacos', 2, [], 'comingSoon')],
        edges: [{ prerequisiteNodeKey: 'basico', dependentNodeKey: 'lacos' }],
      }),
    )

    expect(roadmap.toDto([id('1')]).nodes[1]).toEqual(
      expect.objectContaining({
        state: 'comingSoon',
        totalChallenges: 0,
        isCompleted: false,
      }),
    )
  })

  it('does not mutate its revision when snapshots are changed by callers', () => {
    const roadmap = ChallengeRoadmapFaker.fake(roadmapDto())
    const snapshot = roadmap.toDto([id('1')])
    snapshot.nodes[0].challengeIds.push(id('3'))
    snapshot.edges.pop()

    expect(roadmap.toDto([id('1')]).nodes[0].challengeIds).toHaveLength(1)
    expect(roadmap.toDto([id('1')]).edges).toHaveLength(1)
  })
})
