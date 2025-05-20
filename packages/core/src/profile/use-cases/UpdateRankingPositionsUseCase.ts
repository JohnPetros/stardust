import type { UsersRepository } from '../interfaces'
import { Id, Integer } from '#global/domain/structures/index'

export class UpdateRankingPositionsUseCase {
  constructor(private readonly repository: UsersRepository) {}

  async execute(tierId: string) {
    const users = await this.repository.findByTierOrderedByXp(Id.create(tierId))
    let rankingPosition = Integer.create(1)

    for (const user of users) {
      user.updateRankingPosition(rankingPosition)
      rankingPosition = rankingPosition.increment()
    }

    await this.repository.replaceMany(users)
  }
}
