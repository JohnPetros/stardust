import type { UseCase } from '#global/interfaces/UseCase'
import { Integer } from '#global/domain/structures/Integer'
import { Id } from '#global/domain/structures/Id'
import type { UsersRepository } from '../interfaces'
import { UserNotFoundError } from '../errors'
import { AvatarAggregate } from '../domain/aggregates'
import type { UserDto } from '../domain/entities/dtos'

type Request = {
  userId: string
  avatarId: string
  avatarName?: string
  avatarImage?: string
  avatarPrice: number
}

type Response = Promise<UserDto>

export class AquireAvatarUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ userId, avatarId, avatarName, avatarImage, avatarPrice }: Request) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()

    let entity = undefined
    if (avatarName && avatarImage) {
      entity = { name: avatarName, image: avatarImage }
    }
    const avatar = AvatarAggregate.create({ id: avatarId, entity })

    user.buyAvatar(avatar, Integer.create(avatarPrice))
    await this.repository.addAcquiredAvatar(avatar.id, Id.create(userId))
    return user.dto
  }
}
