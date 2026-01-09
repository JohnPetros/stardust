import {
  type Email,
  type Id,
  type Name,
  type Slug,
  type InsigniaRole,
  type Month,
  IdsList,
  Logical,
  Integer,
} from '@stardust/core/global/structures'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { User } from '@stardust/core/profile/entities'
import type { Platform, Visit } from '@stardust/core/profile/structures'
import type { ManyItems } from '@stardust/core/global/types'
import type { UsersListingParams } from '@stardust/core/profile/types'

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
          insignias(role),
          users_unlocked_stars(star_id),
          users_recently_unlocked_stars(star_id),
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
          insignias(role),
          users_unlocked_stars(star_id),
          users_recently_unlocked_stars(star_id),
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
          insignias(role),
          users_unlocked_stars(star_id),
          users_recently_unlocked_stars(star_id),
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
          insignias(role),
          users_unlocked_stars(star_id),
          users_recently_unlocked_stars(star_id),
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

  async findByName(name: Name): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select(
        `*,
        avatar:avatars(*), 
        rocket:rockets(*), 
        tier:tiers(*),
        insignias(role),
        users_unlocked_stars(star_id),
        users_recently_unlocked_stars(star_id),
        users_unlocked_achievements(achievement_id),
        users_rescuable_achievements(achievement_id),
        users_acquired_rockets(rocket_id),
        users_acquired_avatars(avatar_id),
        users_completed_challenges(challenge_id),
        users_upvoted_solutions(solution_id),
        users_upvoted_comments(comment_id)`,
      )
      .eq('name', name.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseUserMapper.toEntity(data)
  }

  async findByEmail(email: Email): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select(
        `*,
        avatar:avatars(*), 
        rocket:rockets(*), 
        tier:tiers(*),
        insignias(role),
        users_unlocked_stars(star_id),
        users_recently_unlocked_stars(star_id),
        users_unlocked_achievements(achievement_id),
        users_rescuable_achievements(achievement_id),
        users_acquired_rockets(rocket_id),
        users_acquired_avatars(avatar_id),
        users_completed_challenges(challenge_id),
        users_upvoted_solutions(solution_id),
        users_upvoted_comments(comment_id)`,
      )
      .eq('email', email.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseUserMapper.toEntity(data)
  }

  async findByGoogleAccountId(googleAccountId: Id): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select(
        `*,
        avatar:avatars(*), 
        rocket:rockets(*), 
        tier:tiers(*),
        insignias(role),
        users_unlocked_stars(star_id),
        users_recently_unlocked_stars(star_id),
        users_unlocked_achievements(achievement_id),
        users_rescuable_achievements(achievement_id),
        users_acquired_rockets(rocket_id),
        users_acquired_avatars(avatar_id),
        users_completed_challenges(challenge_id),
        users_upvoted_solutions(solution_id),
        users_upvoted_comments(comment_id)`,
      )
      .eq('google_account_id', googleAccountId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseUserMapper.toEntity(data)
  }

  async findByGithubAccountId(githubAccountId: Id): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select(
        `*,
        avatar:avatars(*), 
        rocket:rockets(*), 
        tier:tiers(*),
        insignias(role),
        users_unlocked_stars(star_id),
        users_recently_unlocked_stars(star_id),
        users_unlocked_achievements(achievement_id),
        users_rescuable_achievements(achievement_id),
        users_acquired_rockets(rocket_id),
        users_acquired_avatars(avatar_id),
        users_completed_challenges(challenge_id),
        users_upvoted_solutions(solution_id),
        users_upvoted_comments(comment_id)`,
      )
      .eq('github_account_id', githubAccountId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseUserMapper.toEntity(data)
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
        insignias(role),
        users_unlocked_stars(star_id),
        users_recently_unlocked_stars(star_id),
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

  async findMany(params: UsersListingParams): Promise<ManyItems<User>> {
    let query = this.supabase.from('users').select(
      `*,
      avatar:avatars(*), 
      rocket:rockets(*), 
      tier:tiers(*),
      ${params.insigniaRoles.length ? 'insignias!inner(role)' : 'insignias(role)'},
      users_unlocked_stars(star_id),
      users_recently_unlocked_stars(star_id),
      users_unlocked_achievements(achievement_id),
      users_rescuable_achievements(achievement_id),
      users_acquired_rockets(rocket_id),
      users_acquired_avatars(avatar_id),
      users_completed_challenges(challenge_id),
      users_upvoted_solutions(solution_id),
      users_upvoted_comments(comment_id)`,
      {
        count: 'exact',
        head: false,
      },
    )

    if (params.search && params.search.value.length > 1) {
      query = query.ilike('name', `%${params.search.value}%`)
    }

    if (params.levelSorter.isAscending.isTrue) {
      query = query.order('level', { ascending: true })
    } else if (params.levelSorter.isDescending.isTrue) {
      query = query.order('level', { ascending: false })
    }

    if (params.weeklyXpSorter.isAscending.isTrue) {
      query = query.order('weekly_xp', { ascending: true })
    } else if (params.weeklyXpSorter.isDescending.isTrue) {
      query = query.order('weekly_xp', { ascending: false })
    }

    if (params.unlockedStarCountSorter.isAscending.isTrue) {
      query = query.order('count_user_unlocked_stars', { ascending: true })
    } else if (params.unlockedStarCountSorter.isDescending.isTrue) {
      query = query.order('count_user_unlocked_stars', { ascending: false })
    }

    if (params.unlockedAchievementCountSorter.isAscending.isTrue) {
      query = query.order('count_user_unlocked_achievements', { ascending: true })
    } else if (params.unlockedAchievementCountSorter.isDescending.isTrue) {
      query = query.order('count_user_unlocked_achievements', { ascending: false })
    }

    if (params.completedChallengeCountSorter.isAscending.isTrue) {
      query = query.order('count_user_completed_challenges', { ascending: true })
    } else if (params.completedChallengeCountSorter.isDescending.isTrue) {
      query = query.order('count_user_completed_challenges', { ascending: false })
    }

    if (params.spaceCompletionStatus.isCompleted.isTrue) {
      query = query.eq('verify_user_space_completion', true)
    } else if (params.spaceCompletionStatus.isNotCompleted.isTrue) {
      query = query.eq('verify_user_space_completion', false)
    }

    console.log(params.insigniaRoles)
    if (params.insigniaRoles.length) {
      const insigniaRoleValues = params.insigniaRoles.map((role) => role.value)
      query = query.in('insignias.role', insigniaRoleValues)
    }

    if (params.creationPeriod) {
      query = query
        .gte('created_at', params.creationPeriod.startDate.toISOString())
        .lte('created_at', params.creationPeriod.endDate.toISOString())
    }

    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)

    query = query.order('created_at', { ascending: false }).range(range.from, range.to)

    const { data, count, error } = await query

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const users = data.map(SupabaseUserMapper.toEntity)

    return {
      items: users,
      count: count ?? users.length,
    }
  }

  async findUnlockedStars(userId: Id): Promise<IdsList> {
    const { data, error } = await this.supabase
      .from('users_unlocked_stars')
      .select('star_id, stars(name, number, planets(position))')
      .eq('user_id', userId.value)
      .order('stars(number)', { ascending: true })

    if (error) throw new SupabasePostgreError(error)

    data.sort((a, b) => a.stars.planets.position - b.stars.planets.position)

    return IdsList.create(data.map(({ star_id }) => star_id))
  }

  async findRecentlyUnlockedStars(userId: Id): Promise<IdsList> {
    const { data, error } = await this.supabase
      .from('users_recently_unlocked_stars')
      .select('star_id, stars(number, planets(position))')
      .eq('user_id', userId.value)
      .order('position', {
        referencedTable: 'stars.planets',
        ascending: true,
      })
      .order('number', {
        referencedTable: 'stars',
        ascending: true,
      })

    if (error) throw new SupabasePostgreError(error)

    return IdsList.create(data.map(({ star_id }) => star_id))
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

  async addAcquiredInsignia(insigniaRole: InsigniaRole, userId: Id): Promise<void> {
    const { error: insigniaError, data } = await this.supabase
      .from('insignias')
      .select('id')
      .eq('role', insigniaRole.value)
      .single()

    if (insigniaError) throw new SupabasePostgreError(insigniaError)

    const { error } = await this.supabase
      .from('users_acquired_insignias')
      .insert({ insignia_id: data.id, user_id: userId.value })

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

  async addRecentlyUnlockedStar(starId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_recently_unlocked_stars')
      .insert({ star_id: starId.value, user_id: userId.value })

    if (error) throw new SupabasePostgreError(error)
  }

  async removeRecentlyUnlockedStar(starId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_recently_unlocked_stars')
      .delete()
      .match({ star_id: starId.value, user_id: userId.value })

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

  async countAll(): Promise<Integer> {
    const { count, error } = await this.supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (error) throw new SupabasePostgreError(error)

    return Integer.create(count ?? 0)
  }

  async countByMonth(month: Month): Promise<Integer> {
    const { count, error } = await this.supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', month.firstDay.toISOString())
      .lte('created_at', month.lastDay.toISOString())

    if (error) throw new SupabasePostgreError(error)

    return Integer.create(count ?? 0)
  }

  async countAllCompletedChallenges(): Promise<Integer> {
    const { count, error } = await this.supabase
      .from('users_completed_challenges')
      .select('*', { count: 'exact', head: true })

    if (error) throw new SupabasePostgreError(error)

    return Integer.create(count ?? 0)
  }

  async countCompletedChallengesByMonth(month: Month): Promise<Integer> {
    const { count, error } = await this.supabase
      .from('users_completed_challenges')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', month.firstDay.toISOString())
      .lte('created_at', month.lastDay.toISOString())

    if (error) throw new SupabasePostgreError(error)

    return Integer.create(count ?? 0)
  }

  async countAllUnlockedStars(): Promise<Integer> {
    const { count, error } = await this.supabase
      .from('users_unlocked_stars')
      .select('*', { count: 'exact', head: true })

    if (error) throw new SupabasePostgreError(error)

    return Integer.create(count ?? 0)
  }

  async countUnlockedStarsByMonth(month: Month): Promise<Integer> {
    const { count, error } = await this.supabase
      .from('users_unlocked_stars')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', month.firstDay.toISOString())
      .lte('created_at', month.lastDay.toISOString())

    if (error) throw new SupabasePostgreError(error)

    return Integer.create(count ?? 0)
  }

  async countVisitsByDateAndPlatform(date: Date, platform: Platform): Promise<Integer> {
    const startOfDay = new Date(date)
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setUTCHours(23, 59, 59, 999)

    const { count, error } = await this.supabase
      .from('users_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())
      .eq('platform', platform.name)

    if (error) throw new SupabasePostgreError(error)

    return Integer.create(count ?? 0)
  }

  async addVisit(visit: Visit): Promise<void> {
    const { error } = await this.supabase.from('users_visits').insert({
      user_id: visit.userId.value,
      platform: visit.platform.name,
      created_at: visit.createdAt.toISOString(),
    })

    if (error) throw new SupabasePostgreError(error)
  }

  async hasVisit(visit: Visit): Promise<Logical> {
    const createdAt = visit.createdAt
    const startOfDay = new Date(createdAt)
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(createdAt)
    endOfDay.setUTCHours(23, 59, 59, 999)

    const { data, error } = await this.supabase
      .from('users_visits')
      .select('*')
      .eq('user_id', visit.userId.value)
      .eq('platform', visit.platform.name)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return Logical.create(data.length > 0)
  }
}
