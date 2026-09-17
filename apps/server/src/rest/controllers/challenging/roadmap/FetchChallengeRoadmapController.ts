import type { GetChallengeRoadmapUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  body: {
    userCompletedChallengesIds?: string[]
  }
}

export class FetchChallengeRoadmapController implements Controller<Schema> {
  constructor(private readonly getChallengeRoadmap: GetChallengeRoadmapUseCase) {}

  async handle(http: Http<Schema>) {
    const { userCompletedChallengesIds } = (await http.getBody()) ?? {}
    const roadmap = await this.getChallengeRoadmap.execute({
      completedChallengeIds: userCompletedChallengesIds,
    })
    return http.send(roadmap)
  }
}
