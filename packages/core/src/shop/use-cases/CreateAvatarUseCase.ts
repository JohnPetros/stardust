import type { UseCase } from '#global/interfaces/index'
import type { AvatarsRepository } from '../interfaces/index'
import type { AvatarDto } from '../domain/entities/dtos'
import { Avatar } from '../domain/entities/index'
import { Logical } from '#global/domain/structures/index'

type Request = {
  avatarDto: AvatarDto
}

type Response = Promise<AvatarDto>

export class CreateAvatarUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: AvatarsRepository) {}

  async execute({ avatarDto }: Request) {
    const avatar = Avatar.create(avatarDto)
    if (avatar.isSelectedByDefault.isTrue) {
      await this.updateCurrentSelectedAvatarByDefault()
    }
    await this.repository.add(avatar)
    return avatar.dto
  }

  async updateCurrentSelectedAvatarByDefault(): Promise<void> {
    const avatar = await this.repository.findSelectedByDefault()
    if (avatar) {
      avatar.isSelectedByDefault = Logical.createAsFalse()
      await this.repository.replace(avatar)
    }
  }
}
