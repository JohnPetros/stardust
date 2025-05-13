import type { ProfileService } from '#profile/interfaces/ProfileService'
import type { UseCase } from '../interfaces'
import { User } from '../domain/entities'

type Request = {
  userId: string
  userEmail: string
  userName: string
  firstTierId: string
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
}

export class CreateUserUseCase implements UseCase<Request> {
  constructor(private readonly profileService: ProfileService) {}

  async execute({
    userId,
    userEmail,
    userName,
    firstTierId,
    selectedRocketByDefaultId,
    selectedAvatarByDefaultId,
  }: Request) {
    await Promise.all([this.fetchUserByEmail(userEmail), this.fetchUserByName(userName)])

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

    const response = await this.profileService.saveUser(user)
    if (response.isFailure) response.throwError()
  }

  async fetchUserByName(name: string) {
    const response = await this.profileService.fetchUserName(name)
    if (response.isSuccess) response.throwError()
  }

  async fetchUserByEmail(email: string) {
    const response = await this.profileService.fetchUserEmail(email)
    if (response.isSuccess) response.throwError()
  }
}
