import { User } from '#global/entities'
import type {
  IProfileService,
  IRankingService,
  IShopService,
  ISpaceService,
  IUseCase,
} from '#interfaces'
import { Tier } from '#ranking/entities'
import { Avatar, Rocket } from '#shop/entities'
import {
  SelectedAvatarByDefaultNotFoundError,
  SelectedRocketByDefaultNotFoundError,
} from '#shop/errors'
import { Planet } from '#space/entities'

type Request = {
  userId: string
  userName: string
  userEmail: string
}

type Dependencies = {
  profileService: IProfileService
  rankingService: IRankingService
  shopService: IShopService
  spaceService: ISpaceService
}

export class CreateUserUseCase implements IUseCase<Request> {
  private readonly profileService: IProfileService
  private readonly rankingService: IRankingService
  private readonly shopService: IShopService
  private readonly spaceService: ISpaceService

  constructor({
    profileService,
    rankingService,
    shopService,
    spaceService,
  }: Dependencies) {
    this.profileService = profileService
    this.rankingService = rankingService
    this.shopService = shopService
    this.spaceService = spaceService
  }

  async do({ userId, userEmail, userName }: Request) {
    const [
      acquirableRocketsByDefault,
      acquirableAvatarsByDefault,
      firstTier,
      firstPlanet,
    ] = await Promise.all([
      this.fetchAcquirableRocketsByDefault(),
      this.fetchAcquirableAvatarsByDefault(),
      this.fetchFirstTier(),
      this.fetchFirstPlanet(),
    ])

    const selectedAvatarByDefault = acquirableAvatarsByDefault.find(
      (avatar) => avatar.isSelectedByDefault,
    )
    const selectedRocketByDefault = acquirableRocketsByDefault.find(
      (rocket) => rocket.isSelectedByDefault,
    )

    if (!selectedAvatarByDefault) throw new SelectedAvatarByDefaultNotFoundError()
    if (!selectedRocketByDefault) throw new SelectedRocketByDefaultNotFoundError()

    const user = User.create({
      id: userId,
      name: userName,
      email: userEmail,
      avatar: selectedAvatarByDefault.dto,
      rocket: selectedRocketByDefault.dto,
      tier: firstTier.dto,
    })

    const response = await this.profileService.saveUser(user)
    if (response.isFailure) response.throwError()

    await Promise.all([
      this.saveAcquireShopItems(
        acquirableRocketsByDefault,
        acquirableAvatarsByDefault,
        user.id,
      ),
      this.saveFirstUserUnlockedStar(firstPlanet, user.id),
    ])
  }

  private async fetchFirstPlanet() {
    const response = await this.spaceService.fetchFirstPlanet()
    if (response.isFailure) response.throwError()
    return Planet.create(response.body)
  }

  private async fetchFirstTier() {
    const response = await this.rankingService.fetchFirstTier()
    if (response.isFailure) {
      response.throwError()
    }

    return Tier.create(response.body)
  }

  private async fetchAcquirableAvatarsByDefault() {
    const response = await this.shopService.fetchAcquirableAvatarsByDefault()

    if (response.isFailure) {
      response.throwError()
    }

    return response.body.map(Avatar.create)
  }

  private async fetchAcquirableRocketsByDefault() {
    const response = await this.shopService.fetchAcquirableRocketsByDefault()

    if (response.isFailure) {
      response.throwError()
    }

    return response.body.map(Rocket.create)
  }

  private async saveAcquireShopItems(
    rockets: Rocket[],
    avatars: Avatar[],
    userId: string,
  ) {
    await Promise.all([
      ...rockets.map((rocket) => this.saveAcquiredRocket(rocket.id, userId)),
      ...avatars.map((avatar) => this.saveAcquiredAvatar(avatar.id, userId)),
    ])
  }

  private async saveAcquiredAvatar(avatarId: string, userId: string) {
    const response = await this.shopService.saveAcquiredAvatar(avatarId, userId)

    if (response.isFailure) {
      response.throwError()
    }
  }

  private async saveAcquiredRocket(avatarId: string, userId: string) {
    const response = await this.shopService.saveAcquiredRocket(avatarId, userId)

    if (response.isFailure) {
      response.throwError()
    }
  }

  private async saveFirstUserUnlockedStar(planet: Planet, userId: string) {
    const response = await this.spaceService.saveUserUnlockedStar(
      planet.firstStar.id,
      userId,
    )

    if (response.isFailure) response.throwError()
  }
}
