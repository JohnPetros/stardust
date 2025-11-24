import type { UseCase } from '#global/interfaces/index'
import { Name, Email } from '#global/domain/structures/index'
import { User } from '#global/domain/entities/index'
import type { UsersRepository } from '#profile/interfaces/index'
import {
  UserNameAlreadyInUseError,
  UserEmailAlreadyInUseError,
} from '#profile/domain/errors/index'

type Request = {
  userId: string
  userEmail: string
  userName: string
  firstTierId: string
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
}

type Response = Promise<void>

export class CreateUserUseCase implements UseCase<Request, Response> {
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
    const user = await this.repository.findByName(name)
    if (user) throw new UserNameAlreadyInUseError()
  }

  async verifyUserEmailInUse(email: Email) {
    const user = await this.repository.findByEmail(email)
    if (user) throw new UserEmailAlreadyInUseError()
  }
}
