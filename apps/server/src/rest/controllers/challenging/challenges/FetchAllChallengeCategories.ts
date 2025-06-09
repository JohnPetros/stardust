import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'

export class FetchAllChallengeCategoriesController implements Controller {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async handle(http: Http) {
    const challengeCategories = await this.challengesRepository.findAllCategories()
    return http.send(challengeCategories.map((category) => category.dto))
  }
}
