import type { Database } from '#global/interfaces/Database'
import { Integer } from '#global/domain/structures/Integer'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import { SelectedRocketByDefaultNotFoundError } from '../domain/errors'
import { SelectedAvatarByDefaultNotFoundError } from '../domain/errors'
import { ShopItemsAcquiredByDefaultEvent } from '../domain/events'
import type { Avatar, Rocket } from '../domain/entities'
import type { AvatarsRepository, RocketsRepository } from '../interfaces'

type Request = {
  user: {
    id: string
    name: string
    email: string
  }
  firstReachedTierId: string
  firstUnlockedStarId: string
}

export class AquireDefaultShopItemsUseCase implements UseCase<Request, void> {
  constructor(
    private readonly database: Database,
    private readonly rocketsRepository: RocketsRepository,
    private readonly avatarsRepository: AvatarsRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction(request: Request) {
    const [rockets, avatars] = await this.findFreeItems()
    const event = this.defaultEvent(request, rockets, avatars)
    await this.broker.publish(event)
  }

  private defaultEvent(request: Request, rockets: Rocket[], avatars: Avatar[]) {
    return new ShopItemsAcquiredByDefaultEvent({
      ...request,
      ...this.defaultAvatarIds(avatars),
      ...this.defaultRocketIds(rockets),
    })
  }

  private defaultAvatarIds(avatars: Avatar[]) {
    return {
      selectedAvatarByDefaultId: this.selectedAvatar(avatars).id.value,
      acquiredAvatarsByDefaultIds: avatars
        .filter((item) => item.isAcquiredByDefault)
        .map((item) => item.id.value),
    }
  }

  private selectedAvatar(avatars: Avatar[]) {
    const selected = avatars.find((item) => item.isSelectedByDefault)
    if (!selected) throw new SelectedAvatarByDefaultNotFoundError()
    return selected
  }

  private defaultRocketIds(rockets: Rocket[]) {
    return {
      selectedRocketByDefaultId: this.selectedRocket(rockets).id.value,
      acquiredRocketsByDefaultIds: rockets
        .filter((item) => item.isAcquiredByDefault)
        .map((item) => item.id.value),
    }
  }

  private selectedRocket(rockets: Rocket[]) {
    const selected = rockets.find((item) => item.isSelectedByDefault)
    if (!selected) throw new SelectedRocketByDefaultNotFoundError()
    return selected
  }
  private findFreeItems() {
    return Promise.all([
      this.rocketsRepository.findAllByPrice(Integer.create(0)),
      this.avatarsRepository.findAllByPrice(Integer.create(0)),
    ])
  }
}
