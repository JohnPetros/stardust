import type { UseCase } from '#global/interfaces/UseCase'
import { Integer } from '#global/domain/structures/Integer'
import { Id } from '#global/domain/structures/Id'
import { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import type { UserDto } from '../domain/entities/dtos'
import type { UsersRepository } from '../interfaces'
import { UserNotFoundError } from '../errors'

type Request = {
  userId: string
  insigniaRole: string
  insigniaPrice: number
}

type Response = Promise<UserDto>

export class AcquireInsigniaUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ userId, insigniaRole, insigniaPrice }: Request) {
    const user = await this.findUser(Id.create(userId))
    user.acquireInsignia(InsigniaRole.create(insigniaRole), Integer.create(insigniaPrice))
    await this.repository.replace(user)
    return user.dto
  }

  async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }
}
