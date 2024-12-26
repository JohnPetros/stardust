import { User } from '#global/entities'
import type {
  IProfileService,
  IRankingService,
  IShopService,
  IUseCase,
} from '#interfaces'

type Request = {
  userId: string
  userName: string
  userEmail: string
  avatarId: string
  rocketId: string
  tierId: string
}

export class CreateUserUseCase implements IUseCase<Request> {
  constructor(
    private readonly profileService: IProfileService,
    private readonly rankingService: IRankingService,
    private readonly shopService: IShopService,
  ) {}

  async do({ userId, userEmail, userName, rocketId, avatarId, tierId }: Request) {
    const [avatarDto, rocketDto, tierDto] = await Promise.all([
      this.fetchAvatar(avatarId),
      this.fetchRocket(rocketId),
      this.fetchTier(tierId),
    ])

    const user = User.create({
      id: userId,
      name: userName,
      email: userEmail,
      avatar: avatarDto,
      rocket: rocketDto,
      tier: tierDto,
    })

    const response = await this.profileService.saveUser(user)
    if (response.isFailure) response.throwError()
  }

  private async fetchAvatar(avatarId: string) {
    const response = await this.shopService.fetchAvatarById(avatarId)
    if (response.isFailure) {
      response.throwError()
    }

    return response.body
  }

  private async fetchRocket(rocketId: string) {
    const response = await this.shopService.fetchRocketById(rocketId)
    if (response.isFailure) {
      response.throwError()
    }

    return response.body
  }

  private async fetchTier(tierId: string) {
    const response = await this.rankingService.fetchTierById(tierId)
    if (response.isFailure) {
      response.throwError()
    }

    return response.body
  }
}
