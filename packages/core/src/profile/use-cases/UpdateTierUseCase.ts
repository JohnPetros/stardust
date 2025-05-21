import { Id, IdsList } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UsersRepository } from '../interfaces'

type Request = {
  tierId: string
  usersIds: string[]
}

export class UpdateTierUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(request: Request) {
    const { tierId, usersIds } = request
    const users = await this.repository.findByIdsList(IdsList.create(usersIds))
    for (const user of users) {
      user.updateTier(Id.create(tierId))
    }
    await this.repository.replaceMany(users)
  }
}
