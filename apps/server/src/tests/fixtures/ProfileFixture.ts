import { and, eq } from 'drizzle-orm'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import {
  avatarModel,
  rocketModel,
  tierModel,
  userModel,
  userRescuableAchievementModel,
} from '@/database/drizzle/schema'
import { randomUUID } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'

import type { AchievementDto, UserDto } from '@stardust/core/profile/entities/dtos'
import type {
  AchievementsRepository,
  UsersRepository,
} from '@stardust/core/profile/interfaces'
import { TiersFaker } from '@stardust/core/ranking/entities/fakers'
import { AvatarsFaker, RocketsFaker } from '@stardust/core/shop/entities/fakers'
import { Achievement, User } from '@stardust/core/profile/entities'

import {
  DrizzleAchievementsRepository,
  DrizzleUsersRepository,
} from '@/database/drizzle/repositories'
import { Id } from '@stardust/core/global/structures'

export class ProfileFixture {
  private readonly achivementsRepository: AchievementsRepository
  private readonly usersRepository: UsersRepository

  constructor(_supabase: SupabaseClient) {
    this.achivementsRepository = new DrizzleAchievementsRepository(
      DrizzleClient.getInstance(),
      { kind: 'system' },
    )
    this.usersRepository = new DrizzleUsersRepository(DrizzleClient.getInstance(), {
      kind: 'system',
    })
  }

  async createAchievements(AchievementDtos: AchievementDto[]) {
    await this.achivementsRepository.addMany(AchievementDtos.map(Achievement.create))
  }

  async createUsers(usersDto: UserDto[]) {
    await this.usersRepository.addMany(usersDto.map(User.create))
  }

  async createAccountUser(accountId: string) {
    const avatarId = randomUUID()
    const rocketId = randomUUID()
    const tierId = randomUUID()

    const avatar = AvatarsFaker.fakeDto({
      name: `Avatar ${avatarId}`,
      image: `https://stardust.dev/test/avatar-${avatarId}.jpg`,
    })
    const rocket = RocketsFaker.fake({
      name: `Rocket ${rocketId}`,
      image: `https://stardust.dev/test/rocket-${rocketId}.jpg`,
    }).dto
    const tier = TiersFaker.fakeDto({
      name: `Tier ${tierId}`,
      image: `https://stardust.dev/test/tier-${tierId}.jpg`,
      position: Math.floor(Math.random() * 100000) + 1000,
    })

    await DrizzleClient.getInstance().transaction(async (transaction) => {
      await transaction.insert(avatarModel).values({
        id: avatar.id,
        name: avatar.name,
        image: avatar.image,
        price: avatar.price,
        isAcquiredByDefault: avatar.isAcquiredByDefault ?? false,
        isSelectedByDefault: avatar.isSelectedByDefault ?? false,
      })
      await transaction.insert(rocketModel).values({
        id: rocket.id,
        name: rocket.name,
        image: rocket.image,
        price: rocket.price,
        isAcquiredByDefault: rocket.isAcquiredByDefault ?? false,
        isSelectedByDefault: rocket.isSelectedByDefault ?? false,
      })
      await transaction.insert(tierModel).values({
        id: tier.id,
        name: tier.name,
        image: tier.image,
        position: tier.position,
        reward: tier.reward,
      })
      await transaction.insert(userModel).values({
        id: accountId,
        email: `test-${randomUUID()}@stardust.dev`,
        name: `Test User ${randomUUID()}`,
        slug: `user-${randomUUID()}`,
        avatarId: avatar.id,
        rocketId: rocket.id,
        tierId: tier.id,
      })
    })

    return {
      id: Id.create(accountId),
    }
  }

  async getUserCoins(userId: string) {
    const [row] = await DrizzleClient.getInstance()
      .select({ coins: userModel.coins })
      .from(userModel)
      .where(eq(userModel.id, userId))
    if (!row) throw new Error('Expected a persisted fixture user')
    return row.coins
  }

  async getRescuableAchievements(userId: string, achievementId: string) {
    return await DrizzleClient.getInstance()
      .select({ achievement_id: userRescuableAchievementModel.achievementId })
      .from(userRescuableAchievementModel)
      .where(
        and(
          eq(userRescuableAchievementModel.userId, userId),
          eq(userRescuableAchievementModel.achievementId, achievementId),
        ),
      )
  }
}
