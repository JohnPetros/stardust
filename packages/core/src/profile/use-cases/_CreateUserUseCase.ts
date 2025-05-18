import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import type { UseCase } from '../../global/interfaces'
import { User } from '../../global/domain/entities'
import { Name } from '#global/domain/structures/Name'
import { Email } from '#global/domain/structures/Email'
import { UserNameAlreadyInUseError, UserEmailAlreadyInUseError } from '../errors'

type Request = {
  userId: string
  userEmail: string
  userName: string
  firstTierId: string
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
}

export class _CreateUserUseCase implements UseCase<Request> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({
    userId,
    userEmail,
    userName,
    firstTierId,
    selectedRocketByDefaultId,
    selectedAvatarByDefaultId,
  }: Request) {
    await Promise.all([
      this.verifyUserEmailInUse(Email.create(userEmail)),
      this.verifyUserNameInUse(Name.create(userName)),
    ])

    const user = User.create({
      id: userId,
      name: userName,
      email: userEmail,
      avatar: {
        id: selectedAvatarByDefaultId,
      },
      rocket: {
        id: selectedRocketByDefaultId,
      },
      tier: {
        id: firstTierId,
      },
      createdAt: new Date(),
    })

    await this.repository.add(user)
  }

  async verifyUserNameInUse(name: Name) {
    const contains = await this.repository.containsWithName(name)
    if (contains.isTrue) throw new UserNameAlreadyInUseError()
  }

  async verifyUserEmailInUse(email: Email) {
    const contains = await this.repository.containsWithEmail(email)
    if (contains.isTrue) throw new UserEmailAlreadyInUseError()
  }
}
