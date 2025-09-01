import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../domain/entities/dtos'
import { Id, Slug, AccountProvider } from '#global/domain/structures/index'
import { UserNotFoundError } from '../errors'
import type { UsersRepository } from '../interfaces'

type Request = {
  userId?: string
  userSlug?: string
  userAccountProvider?: string
}

type Response = Promise<UserDto>

export class GetUserUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ userId, userSlug, userAccountProvider }: Request) {
    if (userId) {
      const accountProvider = AccountProvider.create(userAccountProvider)
      let user = null

      switch (accountProvider.value) {
        case 'email':
          user = await this.findUserById(userId)
          break
        case 'google':
          user = await this.findUserByGoogleAccountId(userId)
          break
        case 'github':
          user = await this.findUserByGithubAccountId(userId)
          break
        default:
          throw new UserNotFoundError()
      }

      if (!user) throw new UserNotFoundError()
      return user.dto
    }

    if (userSlug) {
      const user = await this.repository.findBySlug(Slug.create(userSlug))
      if (!user) throw new UserNotFoundError()
      return user.dto
    }

    throw new UserNotFoundError()
  }

  private async findUserById(userId: string) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) {
      throw new UserNotFoundError()
    }
    return user
  }

  private async findUserByGoogleAccountId(userId: string) {
    const user = await this.repository.findByGoogleAccountId(Id.create(userId))
    if (!user) {
      throw new UserNotFoundError()
    }
    return user
  }

  private async findUserByGithubAccountId(userId: string) {
    const user = await this.repository.findByGithubAccountId(Id.create(userId))
    if (!user) {
      throw new UserNotFoundError()
    }
    return user
  }
}
