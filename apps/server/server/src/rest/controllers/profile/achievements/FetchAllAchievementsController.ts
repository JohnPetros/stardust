import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'
import type { Controller } from '@stardust/core/global/interfaces'

export class FetchAllAchievementsController implements Controller {
  constructor(private readonly repository: AchievementsRepository) {}

  async handle(http: Http): Promise<RestResponse> {
    const achievements = await this.repository.findAll()
    return http.send(achievements.map((achievement) => achievement.dto))
  }
}
