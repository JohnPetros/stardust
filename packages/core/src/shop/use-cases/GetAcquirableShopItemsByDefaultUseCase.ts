import type { IShopService, IUseCase } from '../../global/interfaces'
import { Avatar, Rocket } from '../domain/entities'
import {
  SelectedAvatarByDefaultNotFoundError,
  SelectedRocketByDefaultNotFoundError,
} from '../domain/errors'

type Response = Promise<{
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
  acquirableAvatarsByDefaultIds: string[]
  acquirableRocketsByDefaultIds: string[]
}>

export class GetAcquirableShopItemsByDefaultUseCase implements IUseCase<void, Response> {
  constructor(private readonly shopService: IShopService) {}

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
      selectedAvatarByDefaultId: selectedAvatarByDefault.id,
      selectedRocketByDefaultId: selectedRocketByDefault.id,
      acquirableAvatarsByDefaultIds: avatars.map((avatar) => avatar.id),
      acquirableRocketsByDefaultIds: rockets.map((rocket) => rocket.id),
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
