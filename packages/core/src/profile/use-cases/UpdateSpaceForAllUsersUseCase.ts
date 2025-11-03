import type { UseCase } from '#global/interfaces/UseCase'
import type { UsersRepository } from '../interfaces'
import { Id } from '../../global/domain/structures/Id'

type Request = {
  reorderedStarIds: string[]
}

export class UpdateSpaceForAllUsersUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(request: Request): Promise<void> {
    const reorderedStarIds = request.reorderedStarIds.map(Id.create)
    const users = await this.repository.findById(
      Id.create('2ac3e189-e5ed-4003-a87a-d2358411584e'),
    )
    if (!users) return

    await Promise.all([users].map((user) => this.update(user.id, reorderedStarIds)))
  }

  private async update(userId: Id, reorderedStarIds: Id[]): Promise<void> {
    let unlockedStars = await this.repository.findUnlockedStars(userId)

    console.log({ userId })

    for (let index = 0; index < unlockedStars.count.value; index++) {
      const unlockedStarId = unlockedStars.ids[index]
      const reorderedStarId = reorderedStarIds[index]

      if (unlockedStarId.value !== reorderedStarId.value) {
        await Promise.all([
          this.repository.addUnlockedStar(reorderedStarId, userId),
          this.repository.addRecentlyUnlockedStar(reorderedStarId, userId),
        ])
        unlockedStars = unlockedStars.addAt(reorderedStarId, index)
      }
    }
  }
}
