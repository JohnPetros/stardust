import type { UseCase } from '#global/interfaces/index'
import type { AvatarsRepository } from '../interfaces/index'
import type { AvatarDto } from '../domain/entities/dtos'
import { Avatar } from '../domain/entities/index'

type Request = {
  avatarDto: AvatarDto
}

type Response = Promise<AvatarDto>

export class CreateAvatarUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: AvatarsRepository) {}

  async execute({ avatarDto }: Request) {
    const avatar = Avatar.create({
      ...avatarDto,
      isAcquiredByDefault: false,
      isSelectedByDefault: false,
    })
    await this.repository.add(avatar)
    return avatar.dto
  }
}
