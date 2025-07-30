import {
  type Email,
  type Id,
  type Name,
  type Slug,
  type IdsList,
  Logical,
} from '@stardust/core/global/structures'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { User } from '@stardust/core/profile/entities'

import type { SupabaseUser } from '../../types'
import { SupabaseUserMapper } from '../../mappers/profile'
import { SupabasePostgreError } from '../../errors'
import { SupabaseRepository } from '../SupabaseRepository'

export class SupabaseUsersRepository
  extends SupabaseRepository
  implements UsersRepository
{
  async findById(userId: Id): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select(
        `*,
          avatar:avatars(*), 
          rocket:rockets(*), 
          tier:tiers(*),
          users_unlocked_stars(star_id),
          users_unlocked_achievements(achievement_id),
          users_rescuable_achievements(achievement_id),
          users_acquired_rockets(rocket_id),
          users_acquired_avatars(avatar_id),
          users_completed_challenges(challenge_id),
          users_upvoted_solutions(solution_id),
          users_upvoted_comments(comment_id)`,
      )
      .eq('id', userId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    const supabaseUser: SupabaseUser = {
      ...data,
      users_completed_planets: await this.findUserCompletedPlanets(data.id),
    }

    return SupabaseUserMapper.toEntity(supabaseUser)
  }

  async findByIdsList(idsList: IdsList): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select(
        `*,
          avatar:avatars(*), 
          rocket:rockets(*), 
          tier:tiers(*),
          users_unlocked_stars(star_id),
          users_unlocked_achievements(achievement_id),
          users_rescuable_achievements(achievement_id),
          users_acquired_rockets(rocket_id),
          users_acquired_avatars(avatar_id),
          users_completed_challenges(challenge_id),
          users_upvoted_solutions(solution_id),
          users_upvoted_comments(comment_id)`,
      )
      .in('id', idsList.dto)

    if (error) throw new SupabasePostgreError(error)

    return data.map(SupabaseUserMapper.toEntity)
  }

  async findBySlug(slug: Slug): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select(
        `*, 
          avatar:avatars(*), 
          rocket:rockets(*), 
          tier:tiers(*),
          users_unlocked_stars(star_id),
          users_unlocked_achievements(achievement_id),
          users_rescuable_achievements(achievement_id),
          users_acquired_rockets(rocket_id),
          users_acquired_avatars(avatar_id),
          users_completed_challenges(challenge_id),
          users_upvoted_solutions(solution_id),
          users_upvoted_comments(comment_id)`,
      )
      .eq('slug', slug.value)
      .single()

    if (error && error.code === this.POSTGRES_ERROR_CODES.PGRST116) {
      return null
    }

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const supabaseUser: SupabaseUser = {
      ...data,
      users_completed_planets: await this.findUserCompletedPlanets(data.id),
    }

    return SupabaseUserMapper.toEntity(supabaseUser)
  }

  async findByTierOrderedByXp(tierId: Id): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select(
        `*,
          avatar:avatars(*), 
          rocket:rockets(*), 
          tier:tiers(*),
          users_unlocked_stars(star_id),
          users_unlocked_achievements(achievement_id),
          users_rescuable_achievements(achievement_id),
          users_acquired_rockets(rocket_id),
          users_acquired_avatars(avatar_id),
          users_completed_challenges(challenge_id),
          users_upvoted_solutions(solution_id),
          users_upvoted_comments(comment_id)`,
      )
      .eq('tier_id', tierId.value)
      .order('xp', { ascending: false })

    if (error) throw new SupabasePostgreError(error)

    return data.map(SupabaseUserMapper.toEntity)
  }

  private async findUserCompletedPlanets(
    userId: string,
  ): Promise<{ planet_id: string | null }[]> {
    const { data, error } = await this.supabase
      .from('users_completed_planets_view')
      .select('planet_id')
      .eq('user_id', userId)

    if (error) throw new SupabasePostgreError(error)

    return data
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await this.supabase.from('users').select(
      `*,
        avatar:avatars(*), 
        rocket:rockets(*), 
        tier:tiers(*),
        users_unlocked_stars(star_id),
        users_unlocked_achievements(achievement_id),
        users_rescuable_achievements(achievement_id),
        users_acquired_rockets(rocket_id),
        users_acquired_avatars(avatar_id),
        users_completed_challenges(challenge_id),
        users_upvoted_solutions(solution_id),
        users_upvoted_comments(comment_id)`,
    )

    if (error) throw new SupabasePostgreError(error)

    return data.map(SupabaseUserMapper.toEntity)
  }

  async containsWithEmail(email: Email): Promise<Logical> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .ilike('email', `%${email.value}%`)
      .single()

    if (error && error.code === this.POSTGRES_ERROR_CODES.PGRST116) {
      return Logical.createAsFalse()
    }

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return Logical.create(data !== null)
  }

  async containsWithName(name: Name): Promise<Logical> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .ilike('name', `%${name.value}%`)
      .single()

    if (error && error.code === this.POSTGRES_ERROR_CODES.PGRST116) {
      return Logical.createAsFalse()
    }

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return Logical.create(data !== null)
  }

  async add(user: User): Promise<void> {
    const supabaseUser = SupabaseUserMapper.toSupabase(user)

    const { error } = await this.supabase.from('users').insert({
      id: user.id.value,
      name: supabaseUser.name,
      email: supabaseUser.email,
      slug: supabaseUser.slug,
      avatar_id: supabaseUser.avatar_id,
      rocket_id: supabaseUser.rocket_id,
      tier_id: supabaseUser.tier_id,
      coins: supabaseUser.coins,
      xp: supabaseUser.xp,
      weekly_xp: supabaseUser.weekly_xp,
      streak: supabaseUser.streak,
      level: supabaseUser.level,
      week_status: supabaseUser.week_status,
    })

    if (error) throw new SupabasePostgreError(error)
  }

  async addAcquiredRocket(rocketId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_acquired_rockets')
      .insert({ rocket_id: rocketId.value, user_id: userId.value })

    if (error) throw new SupabasePostgreError(error)
  }

  async addAcquiredAvatar(avatarId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_acquired_avatars')
      .insert({ avatar_id: avatarId.value, user_id: userId.value })

    if (error) throw new SupabasePostgreError(error)
  }

  async addUnlockedStar(starId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_unlocked_stars')
      .insert({ star_id: starId.value, user_id: userId.value })

    if (error) throw new SupabasePostgreError(error)
  }

  async addUnlockedAchievement(achievementId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_unlocked_achievements')
      .insert({ achievement_id: achievementId.value, user_id: userId.value })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async addRescuableAchievement(achievementId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_rescuable_achievements')
      .insert({ achievement_id: achievementId.value, user_id: userId.value })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async addUpvotedComment(commentId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_upvoted_comments')
      .insert({ comment_id: commentId.value, user_id: userId.value })

    if (error) throw new SupabasePostgreError(error)
  }

  async removeUpvotedComment(commentId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_upvoted_comments')
      .delete()
      .match({ comment_id: commentId.value, user_id: userId.value })

    if (error) throw new SupabasePostgreError(error)
  }

  async removeRescuableAchievement(achievementId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_rescuable_achievements')
      .delete()
      .match({
        achievement_id: achievementId.value,
        user_id: userId.value,
      })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async addCompletedChallenge(challengeId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_completed_challenges')
      .insert({ challenge_id: challengeId.value, user_id: userId.value })

    if (error) throw new SupabasePostgreError(error)
  }

  async replace(user: User): Promise<void> {
    const supabaseUser = SupabaseUserMapper.toSupabase(user)
    const { error } = await this.supabase
      .from('users')
      .update(supabaseUser)
      .eq('id', user.id.value)

    if (error) throw new SupabasePostgreError(error)
  }

  async replaceMany(users: User[]): Promise<void> {
    const promises = []

    for (const user of users) {
      promises.push(this.replace(user))
    }

    await Promise.all(promises)
  }
}
