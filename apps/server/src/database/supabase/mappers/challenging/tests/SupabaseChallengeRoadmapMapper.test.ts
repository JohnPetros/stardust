import { SupabaseChallengeRoadmapMapper } from '../SupabaseChallengeRoadmapMapper'
import type { SupabaseChallenge } from '../../../types'

const challengeId = '00000000-0000-4000-8000-000000000001'

describe('Supabase Challenge Roadmap Mapper', () => {
  it('maps relational roadmap rows to the Core roadmap without leaking row names', () => {
    const roadmap = SupabaseChallengeRoadmapMapper.toEntity({
      revision: {
        id: '00000000-0000-4000-8000-000000000010',
        key: 'desafios',
        version: 1,
        published_at: '2026-09-16T12:00:00.000Z',
      },
      nodes: [
        {
          id: '00000000-0000-4000-8000-000000000011',
          key: 'basico',
          category_id: '00000000-0000-4000-8000-000000000012',
          position_x: 390,
          position_y: 150,
          recommendation_order: 1,
          state: 'content',
          categories: [
            {
              id: '00000000-0000-4000-8000-000000000012',
              name: 'básico',
            },
          ],
        },
      ],
      edges: [],
      nodeChallenges: [
        {
          node_id: '00000000-0000-4000-8000-000000000011',
          challenge_id: challengeId,
          position: 1,
        },
      ],
      challenges: [
        {
          id: challengeId,
          slug: 'enviando-mensagem',
        } as SupabaseChallenge,
      ],
    })

    expect(roadmap.toDto()).toEqual(
      expect.objectContaining({
        revision: expect.objectContaining({ key: 'desafios', version: 1 }),
        nodes: [
          expect.objectContaining({
            key: 'basico',
            category: { id: '00000000-0000-4000-8000-000000000012', name: 'básico' },
            challengeIds: [challengeId],
          }),
        ],
      }),
    )
  })
})
