import type { ListRoadmapNodeChallengesUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    nodeKey: string
  }
  body: {
    userCompletedChallengesIds?: string[]
  }
}

export class ListRoadmapNodeChallengesController implements Controller<Schema> {
  constructor(
    private readonly listRoadmapNodeChallenges: ListRoadmapNodeChallengesUseCase,
  ) {}

  async handle(http: Http<Schema>) {
    const { nodeKey } = http.getRouteParams()
    const { userCompletedChallengesIds } = (await http.getBody()) ?? {}
    const challenges = await this.listRoadmapNodeChallenges.execute({
      nodeKey,
      completedChallengeIds: userCompletedChallengesIds,
    })
    return http.send(challenges)
  }
}
