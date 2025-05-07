import type { ShopService } from '../interfaces'
import {
  SelectedAvatarByDefaultNotFoundError,
  SelectedRocketByDefaultNotFoundError,
} from '../domain/errors'
import { Avatar, Rocket } from '../domain/entities'
import type { UseCase } from '#global/interfaces/UseCase'

type Response = Promise<{
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
  acquirableAvatarsByDefaultIds: string[]
  acquirableRocketsByDefaultIds: string[]
}>

export class GetAcquirableShopItemsByDefaultUseCase implements UseCase<void, Response> {
  constructor(private readonly shopService: ShopService) {}

  async do() {
    const [rockets, avatars] = await Promise.all([
      this.fetchFreeRockets(),
      this.fetchFreeAvatars(),
    ])

    const selectedAvatarByDefault = avatars.find((avatar) => avatar.isSelectedByDefault)
    const selectedRocketByDefault = rockets.find((rocket) => rocket.isSelectedByDefault)

    if (!selectedAvatarByDefault) throw new SelectedAvatarByDefaultNotFoundError()
    if (!selectedRocketByDefault) throw new SelectedRocketByDefaultNotFoundError()

    return {
      selectedAvatarByDefaultId: selectedAvatarByDefault.id.value,
      selectedRocketByDefaultId: selectedRocketByDefault.id.value,
      acquirableAvatarsByDefaultIds: avatars.map((avatar) => avatar.id.value),
      acquirableRocketsByDefaultIds: rockets.map((rocket) => rocket.id.value),
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
    const response = await this.shopService.fetchAcquirableRocketsByDefault()

    if (response.isFailure) {
      response.throwError()
    }

    return response.body.map(Rocket.create)
  }
}
