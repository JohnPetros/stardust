import type { UseCase } from '#global/interfaces/index'
import type { UsersRepository } from '#profile/interfaces/index'
import { AccountProvider, Email, Id, Name } from '#global/domain/structures/index'
import { UserSocialAccountAlreadyInUseError } from '../errors'
import { AppError } from '#global/domain/errors/AppError'

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

  private async findUserBySocialAccount(
    socialAccountId: Id,
    socialAccountProvider: AccountProvider,
  ) {
    switch (socialAccountProvider.value) {
      case 'google': {
        const user = await this.repository.findByGoogleAccountId(socialAccountId)
        if (user) throw new UserSocialAccountAlreadyInUseError()
        break
      }
      case 'github': {
        const user = await this.repository.findByGithubAccountId(socialAccountId)
        if (user) throw new UserSocialAccountAlreadyInUseError()
        break
      }
      default:
        throw new AppError('Provedor de conta social não suportado')
    }
  }

  private async findUserById(userId: Id) {
    const user = await this.repository.findById(userId)
    if (user) {
      throw new UserSocialAccountAlreadyInUseError()
    }
  }
}
