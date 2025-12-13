import type { UseCase } from '#global/interfaces/index'
import type { AvatarsRepository } from '../interfaces/index'
import type { AvatarDto } from '../domain/entities/dtos'
import { Id, Logical } from '#global/domain/structures/index'
import { Avatar } from '../domain/entities/index'
import { AvatarNotFoundError } from '../domain/errors'

type Request = {
  avatarDto: AvatarDto
}

type Response = Promise<AvatarDto>

export class UpdateAvatarUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: AvatarsRepository) {}

  async execute({ avatarDto }: Request) {
    const avatar = Avatar.create(avatarDto)
    await this.findAvatar(avatar.id)
    if (avatar.isSelectedByDefault.isTrue) {
      await this.updateCurrentSelectedAvatarByDefault()
    }
    await this.repository.replace(avatar)
    return avatar.dto
  }

  async updateCurrentSelectedAvatarByDefault(): Promise<void> {
    const avatar = await this.repository.findSelectedByDefault()
    if (avatar) {
      avatar.isSelectedByDefault = Logical.createAsFalse()
      await this.repository.replace(avatar)
    }
  }

  async findAvatar(avatarId: Id): Promise<void> {
    const avatar = await this.repository.findById(avatarId)
    if (!avatar) throw new AvatarNotFoundError()
  }
}
