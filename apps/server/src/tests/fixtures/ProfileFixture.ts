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

import { SupabaseAchievementsRepository, SupabaseUsersRepository } from '@/database'
import { Id } from '@stardust/core/global/structures'

export class ProfileFixture {
  private readonly supabase: SupabaseClient
  private readonly achivementsRepository: AchievementsRepository
  private readonly usersRepository: UsersRepository

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
    this.achivementsRepository = new SupabaseAchievementsRepository(supabase)
    this.usersRepository = new SupabaseUsersRepository(supabase)
  }

  async createAchievements(AchievementDtos: AchievementDto[]) {
    await this.achivementsRepository.addMany(AchievementDtos.map(Achievement.create))
  }

  async createUsers(usersDto: UserDto[]) {
    await this.usersRepository.addMany(usersDto.map(User.create))
  }

  async createAccountUser(accountId: string) {
    const avatar = AvatarsFaker.fakeDto({ name: `Avatar ${randomUUID()}` })
    const rocket = RocketsFaker.fake({ name: `Rocket ${randomUUID()}` }).dto
    const tier = TiersFaker.fakeDto({
      name: `Tier ${randomUUID()}`,
      position: Math.floor(Math.random() * 100000) + 1000,
    })

    const [avatarResponse, rocketResponse, tierResponse] = await Promise.all([
      this.supabase.from('avatars').insert({
        id: avatar.id,
        name: avatar.name,
        image: avatar.image,
        price: avatar.price,
        is_acquired_by_default: avatar.isAcquiredByDefault ?? false,
        is_selected_by_default: avatar.isSelectedByDefault ?? false,
      }),
      this.supabase.from('rockets').insert({
        id: rocket.id,
        name: rocket.name,
        image: rocket.image,
        price: rocket.price,
        slug: `rocket-${randomUUID()}`,
        is_acquired_by_default: rocket.isAcquiredByDefault ?? false,
        is_selected_by_default: rocket.isSelectedByDefault ?? false,
      }),
      this.supabase.from('tiers').insert({
        id: tier.id,
        name: tier.name,
        image: tier.image,
        position: tier.position,
        reward: tier.reward,
      }),
    ])

    if (avatarResponse.error) throw avatarResponse.error
    if (rocketResponse.error) throw rocketResponse.error
    if (tierResponse.error) throw tierResponse.error

    const { error } = await this.supabase.from('users').insert({
      id: accountId,
      email: `test-${randomUUID()}@stardust.dev`,
      name: `Test User ${randomUUID()}`,
      slug: `user-${randomUUID()}`,
      avatar_id: avatar.id,
      rocket_id: rocket.id,
      tier_id: tier.id,
    })

    if (error) {
      throw error
    }

    return {
      id: Id.create(accountId),
    }
  }

  async getUserCoins(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('coins')
      .eq('id', userId)
      .single()

    if (error) {
      throw error
    }

    return data.coins
  }

  async getRescuableAchievements(userId: string, achievementId: string) {
    const { data, error } = await this.supabase
      .from('users_rescuable_achievements')
      .select('achievement_id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)

    if (error) {
      throw error
    }

    return data
  }
}
