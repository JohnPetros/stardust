import type { UseCase } from '#global/interfaces/index'
import type { UsersRepository } from '#profile/interfaces/index'
import { Id, Name } from '#global/domain/structures/index'
import { UserSocialAccountAlreadyInUseError } from '../domain/errors'

type Request = {
  socialAccountId: string
  socialAccountName: string
}

type Response = Promise<{ deduplicatedUserName: string }>

export class VerifyUserSocialAccountUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ socialAccountId, socialAccountName }: Request) {
    const accountId = Id.create(socialAccountId)

    await this.findUserById(accountId)

    let name = Name.create(socialAccountName)
    let user = await this.repository.findByName(name)

    while (user) {
      name = name.deduplicate()
      user = await this.repository.findByName(name)
    }

    return { deduplicatedUserName: name.value }
  }

  private async findUserById(userId: Id) {
    const user = await this.repository.findById(userId)
    if (user) {
      throw new UserSocialAccountAlreadyInUseError()
    }
  }
}
