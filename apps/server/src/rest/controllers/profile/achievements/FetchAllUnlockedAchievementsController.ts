import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { Controller } from '@stardust/core/global/interfaces'
import { Id } from '@stardust/core/global/structures'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'

type Schema = {
  routeParams: {
    userId: string
  }
}

export class FetchAllUnlockedAchievementsController implements Controller<Schema> {
  constructor(private readonly repository: AchievementsRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { userId } = http.getRouteParams()
    const achievements = await this.repository.findAllUnlockedByUser(Id.create(userId))
    return http.sendJson(achievements.map((achievement) => achievement.dto))
  }
}
