import { roadmapNodeKeySchema } from '../challengeRoadmapSchema'

describe('roadmapNodeKeySchema', () => {
  it.each(['basico', 'textos-2', 'lacos'])('accepts the safe key %s', (key) => {
    expect(roadmapNodeKeySchema.safeParse(key).success).toBe(true)
  })

  it.each(['a/b', '../admin', 'Textos', 'textos?x=1', 'textos<script>'])(
    'rejects unsafe keys',
    (key) => {
      expect(roadmapNodeKeySchema.safeParse(key).success).toBe(false)
    },
  )

  it('rejects keys outside the declared bounds', () => {
    expect(roadmapNodeKeySchema.safeParse('a').success).toBe(false)
    expect(roadmapNodeKeySchema.safeParse('a'.repeat(101)).success).toBe(false)
  })
})
