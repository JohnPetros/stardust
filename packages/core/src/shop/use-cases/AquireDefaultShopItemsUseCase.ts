import { Integer } from '#global/domain/structures/Integer'
import type { EventBroker } from '#global/interfaces/EventBroker'
import type { UseCase } from '#global/interfaces/UseCase'
import { SelectedRocketByDefaultNotFoundError } from '../domain/errors'
import { SelectedAvatarByDefaultNotFoundError } from '../domain/errors'
import { ShopItemsAcquiredByDefaultEvent } from '../domain/events'
import type { AvatarsRepository, RocketsRepository } from '../interfaces'

type Request = {
  user: {
    id: string
    name: string
    email: string
  }
  firstTierId: string
  firstStarId: string
}

export class AquireDefaultShopItemsUseCase implements UseCase<Request, void> {
  constructor(
    private readonly rocketsRepository: RocketsRepository,
    private readonly avatarsRepository: AvatarsRepository,
    private readonly eventBroker: EventBroker,
  ) {}

  async execute({ user, firstStarId, firstTierId }: Request) {
    const [rockets, avatars] = await Promise.all([
      this.rocketsRepository.findAllByPrice(Integer.create(0)),
      this.avatarsRepository.findAllByPrice(Integer.create(0)),
    ])

    const rocketsToAquire = rockets.filter((rocket) => rocket.isAcquiredByDefault)
    const avatarsToAquire = avatars.filter((avatar) => avatar.isAcquiredByDefault)

    const selectedAvatarByDefault = avatars.find((avatar) => avatar.isSelectedByDefault)
    const selectedRocketByDefault = rockets.find((rocket) => rocket.isSelectedByDefault)

    if (!selectedAvatarByDefault) throw new SelectedAvatarByDefaultNotFoundError()
    if (!selectedRocketByDefault) throw new SelectedRocketByDefaultNotFoundError()

    const event = new ShopItemsAcquiredByDefaultEvent({
      selectedAvatarByDefaultId: selectedAvatarByDefault.id.value,
      selectedRocketByDefaultId: selectedRocketByDefault.id.value,
      acquiredAvatarsByDefaultIds: avatarsToAquire.map((avatar) => avatar.id.value),
      acquiredRocketsByDefaultIds: rocketsToAquire.map((rocket) => rocket.id.value),
      firstTierId,
      firstStarId,
      user,
    })
    await this.eventBroker.publish(event)
  }
}
