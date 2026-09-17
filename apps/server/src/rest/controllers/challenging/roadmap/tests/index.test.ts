import * as roadmapControllers from '..'

describe('challenge roadmap controller exports', () => {
  it('exports the roadmap controllers from the public barrel', () => {
    expect(roadmapControllers.FetchChallengeRoadmapController).toBeDefined()
    expect(roadmapControllers.ListRoadmapNodeChallengesController).toBeDefined()
  })
})
