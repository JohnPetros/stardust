import type { UseCase } from '#global/interfaces/UseCase'
import type { AvatarsRepository } from '../interfaces'
import { Id } from '#global/domain/structures/index'
import { AvatarNotFoundError } from '../domain/errors'

type Request = {
  avatarId: string
}

export class DeleteAvatarUseCase implements UseCase<Request> {
  constructor(private readonly repository: AvatarsRepository) {}

  async execute({ avatarId }: Request) {
    const avatar = await this.findAvatar(Id.create(avatarId))
    await this.repository.remove(avatar.id)
  }

  async findAvatar(avatarId: Id) {
    const avatar = await this.repository.findById(avatarId)
    if (!avatar) throw new AvatarNotFoundError()
    return avatar
  }
}
