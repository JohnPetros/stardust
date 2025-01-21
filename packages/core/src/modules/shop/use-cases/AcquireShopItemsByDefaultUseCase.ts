import type { IShopService, IUseCase } from '#interfaces'
import { Avatar, Rocket } from '#shop/entities'
import {
  SelectedAvatarByDefaultNotFoundError,
  SelectedRocketByDefaultNotFoundError,
} from '#shop/errors'

type Request = {
  userId: string
}

type Response = Promise<{
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
}>

export class AcquireShopItemsByDefaultUseCase implements IUseCase<Request, Response> {
  constructor(private readonly shopService: IShopService) {}

  async do({ userId }: Request) {
    const [rockets, avatars] = await Promise.all([
      this.fetchFreeRockets(),
      this.fetchFreeAvatars(),
    ])

    await Promise.all([
      ...rockets.map((rocket) => this.saveAcquiredRocket(rocket.id, userId)),
      ...avatars.map((avatar) => this.saveAcquiredAvatar(avatar.id, userId)),
    ])
    const selectedAvatarByDefault = avatars.find((avatar) => avatar.isSelectedByDefault)
    const selectedRocketByDefault = rockets.find((rocket) => rocket.isSelectedByDefault)

    if (!selectedAvatarByDefault) throw new SelectedAvatarByDefaultNotFoundError()
    if (!selectedRocketByDefault) throw new SelectedRocketByDefaultNotFoundError()

    return {
      selectedAvatarByDefaultId: selectedAvatarByDefault.id,
      selectedRocketByDefaultId: selectedRocketByDefault.id,
    }
  }

  private async fetchFreeAvatars() {
    const response = await this.shopService.fetchAcquirableAvatarsByDefault()

    if (response.isFailure) {
      response.throwError()
    }

    return response.body.map(Avatar.create)
  }

  private async fetchFreeRockets() {
    const response = await this.shopService.fetchAcquirableAvatarsByDefault()

    if (response.isFailure) {
      response.throwError()
    }

    return response.body.map(Rocket.create)
  }

  private async saveAcquiredAvatar(avatarId: string, userId: string) {
    const response = await this.shopService.saveAcquiredAvatar(avatarId, userId)

    if (response.isFailure) {
      response.throwError()
    }
  }

  private async saveAcquiredRocket(avatarId: string, userId: string) {
    const response = await this.shopService.saveAcquiredAvatar(avatarId, userId)

    if (response.isFailure) {
      response.throwError()
    }
  }
}
