import type { UseCase } from '#global/interfaces/UseCase'
import type { UsersRepository } from '../interfaces'
import { Id } from '../../global/domain/structures/Id'
import { IdsList } from '../../global/domain/structures/IdsList'

type Request = {
  reorderedStarIds: string[]
}

export class UpdateSpaceForAllUsersUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(request: Request): Promise<void> {
    const reorderedStarIds = request.reorderedStarIds.map(Id.create)
    const users = await this.repository.findAll()

    await Promise.all(users.map((user) => this.update(user.id, reorderedStarIds)))
  }

  private async update(userId: Id, reorderedStarIds: Id[]): Promise<void> {
    const [allUnlockedStars, recentlyUnlockedStars] = await Promise.all([
      this.repository.findUnlockedStars(userId),
      this.repository.findRecentlyUnlockedStars(userId),
    ])
    const reorderedStars = IdsList.create(reorderedStarIds.map((id) => id.value))
    let unlockedStars = IdsList.create(
      allUnlockedStars.dto.filter((id) => reorderedStars.includes(Id.create(id)).isTrue),
    )

    if (unlockedStars.count.value === reorderedStarIds.length) {
      return
    }

    for (let index = 0; index < unlockedStars.count.value; index++) {
      const unlockedStarId = unlockedStars.ids[index]
      const reorderedStarId = reorderedStarIds[index]

      if (
        unlockedStarId.value !== reorderedStarId.value &&
        recentlyUnlockedStars.includes(reorderedStarId).isFalse &&
        unlockedStars.includes(reorderedStarId).isFalse
      ) {
        await Promise.all([
          this.repository.addUnlockedStar(reorderedStarId, userId),
          this.repository.addRecentlyUnlockedStar(reorderedStarId, userId),
        ])
        unlockedStars = unlockedStars.addAt(reorderedStarId, index)
      }
    }
  }
}
