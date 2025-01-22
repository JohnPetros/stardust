import type { IProfileService, IUseCase } from '#interfaces'
import { User } from '#global/entities'

type Request = {
  userId: string
  userEmail: string
  userName: string
  firstTierId: string
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
}

export class CreateUserUseCase implements IUseCase<Request> {
  constructor(private readonly profileService: IProfileService) {}

  async do({
    userId,
    userEmail,
    userName,
    firstTierId,
    selectedRocketByDefaultId,
    selectedAvatarByDefaultId,
  }: Request) {
    await Promise.all([this.fetchUserByEmail(userEmail), this.fetchUserByName(userName)])

    console.log({
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
    })

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
    })

    const response = await this.profileService.saveUser(user)
    if (response.isFailure) response.throwError()
  }

  async fetchUserByName(name: string) {
    const response = await this.profileService.fetchUserName(name)
    console.log('RESPONSE, RESPONSE, RESPONSE', response.isSuccess)
    if (response.isSuccess) response.throwError()
  }

  async fetchUserByEmail(email: string) {
    const response = await this.profileService.fetchUserEmail(email)
    if (response.isSuccess) response.throwError()
  }
}
