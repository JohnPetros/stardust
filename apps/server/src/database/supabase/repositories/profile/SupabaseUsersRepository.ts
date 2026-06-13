import {
  type Email,
  type Id,
  type Name,
  type Slug,
  type InsigniaRole,
  type Month,
  Logical,
  IdsList,
  Integer,
} from '@stardust/core/global/structures'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { User } from '@stardust/core/profile/entities'
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
  private static readonly FALLBACK_USER_SELECT = `*,
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
      users_upvoted_comments(comment_id)`

  private static readonly FULL_USER_SELECT =
    `${SupabaseUsersRepository.FALLBACK_USER_SELECT}, insignias(role), users_recently_unlocked_stars(star_id)`

  private shouldFallbackUserSelect(error: { message: string } | null) {
    return Boolean(
      error?.message.includes(
        "Could not find a relationship between 'users' and 'insignias'",
      ) ||
        error?.message.includes(
          "Could not find a relationship between 'users' and 'users_recently_unlocked_stars'",
        ),
    )
  }

  private normalizeSupabaseUser(data: SupabaseUser): SupabaseUser {
    return {
      ...data,
      insignias: data.insignias ?? [],
      users_recently_unlocked_stars: data.users_recently_unlocked_stars ?? [],
    }
  }

  async findById(userId: Id): Promise<User | null> {
    const primaryResponse = await this.supabase
      .from('users')
      .select(SupabaseUsersRepository.FULL_USER_SELECT)
      .eq('id', userId.value)
      .single()

    let data: SupabaseUser | null = primaryResponse.data as SupabaseUser | null
    let error = primaryResponse.error

    if (this.shouldFallbackUserSelect(error)) {
      const fallbackResponse = await this.supabase
        .from('users')
        .select(SupabaseUsersRepository.FALLBACK_USER_SELECT)
        .eq('id', userId.value)
        .single()

      data = fallbackResponse.data as SupabaseUser | null
      error = fallbackResponse.error
    }

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    if (!data) {
      return null
    }

    const supabaseUser: SupabaseUser = {
      ...this.normalizeSupabaseUser(data as SupabaseUser),
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
    const primaryResponse = await this.supabase
      .from('users')
      .select(SupabaseUsersRepository.FULL_USER_SELECT)
      .eq('slug', slug.value)
      .single()

    let data: SupabaseUser | null = primaryResponse.data as SupabaseUser | null
    let error = primaryResponse.error

    if (this.shouldFallbackUserSelect(error)) {
      const fallbackResponse = await this.supabase
        .from('users')
        .select(SupabaseUsersRepository.FALLBACK_USER_SELECT)
        .eq('slug', slug.value)
        .single()

      data = fallbackResponse.data as SupabaseUser | null
      error = fallbackResponse.error
    }

    if (error && error.code === this.POSTGRES_ERROR_CODES.PGRST116) {
      return null
    }

    if (error) {
      throw new SupabasePostgreError(error)
    }

    if (!data) {
      return null
    }

    const supabaseUser: SupabaseUser = {
      ...this.normalizeSupabaseUser(data),
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
    const primaryResponse = await this.supabase
      .from('users')
      .select(SupabaseUsersRepository.FULL_USER_SELECT)
      .eq('name', name.value)
      .single()

    let data: SupabaseUser | null = primaryResponse.data as SupabaseUser | null
    let error = primaryResponse.error

    if (this.shouldFallbackUserSelect(error)) {
      const fallbackResponse = await this.supabase
        .from('users')
        .select(SupabaseUsersRepository.FALLBACK_USER_SELECT)
        .eq('name', name.value)
        .single()

      data = fallbackResponse.data as SupabaseUser | null
      error = fallbackResponse.error
    }

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return data ? SupabaseUserMapper.toEntity(this.normalizeSupabaseUser(data)) : null
  }

  async findByEmail(email: Email): Promise<User | null> {
    const primaryResponse = await this.supabase
      .from('users')
      .select(SupabaseUsersRepository.FULL_USER_SELECT)
      .eq('email', email.value)
      .single()

    let data: SupabaseUser | null = primaryResponse.data as SupabaseUser | null
    let error = primaryResponse.error

    if (this.shouldFallbackUserSelect(error)) {
      const fallbackResponse = await this.supabase
        .from('users')
        .select(SupabaseUsersRepository.FALLBACK_USER_SELECT)
        .eq('email', email.value)
        .single()

      data = fallbackResponse.data as SupabaseUser | null
      error = fallbackResponse.error
    }

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return data ? SupabaseUserMapper.toEntity(this.normalizeSupabaseUser(data)) : null
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
    const primaryResponse = await this.supabase
      .from('users')
      .select(SupabaseUsersRepository.FULL_USER_SELECT)

    let data = primaryResponse.data as SupabaseUser[] | null
    let error = primaryResponse.error

    if (this.shouldFallbackUserSelect(error)) {
      const fallbackResponse = await this.supabase
        .from('users')
        .select(SupabaseUsersRepository.FALLBACK_USER_SELECT)

      data = fallbackResponse.data as SupabaseUser[] | null
      error = fallbackResponse.error
    }

    if (error) throw new SupabasePostgreError(error)

    return (data ?? []).map((user) =>
      SupabaseUserMapper.toEntity(this.normalizeSupabaseUser(user)),
    )
  }

  async findMany(params: UsersListingParams): Promise<ManyItems<User>> {
    const buildQuery = (select: string) => {
      let query = this.supabase.from('users').select(select, {
        count: 'exact',
        head: false,
      })

      if (params.search && params.search.value.length > 1) {
        query = query.ilike('name', `%${params.search.value}%`)
      }

      if (params.levelOrder.isAscending.isTrue) {
        query = query.order('level', { ascending: true })
      } else if (params.levelOrder.isDescending.isTrue) {
        query = query.order('level', { ascending: false })
      }

      if (params.weeklyXpOrder.isAscending.isTrue) {
        query = query.order('weekly_xp', { ascending: true })
      } else if (params.weeklyXpOrder.isDescending.isTrue) {
        query = query.order('weekly_xp', { ascending: false })
      }

      if (params.unlockedStarCountOrder.isAscending.isTrue) {
        query = query.order('count_user_unlocked_stars', { ascending: true })
      } else if (params.unlockedStarCountOrder.isDescending.isTrue) {
        query = query.order('count_user_unlocked_stars', { ascending: false })
      }

      if (params.unlockedAchievementCountOrder.isAscending.isTrue) {
        query = query.order('count_user_unlocked_achievements', { ascending: true })
      } else if (params.unlockedAchievementCountOrder.isDescending.isTrue) {
        query = query.order('count_user_unlocked_achievements', { ascending: false })
      }

      if (params.completedChallengeCountOrder.isAscending.isTrue) {
        query = query.order('count_user_completed_challenges', { ascending: true })
      } else if (params.completedChallengeCountOrder.isDescending.isTrue) {
        query = query.order('count_user_completed_challenges', { ascending: false })
      }

      if (params.spaceCompletionStatus.isCompleted.isTrue) {
        query = query.eq('verify_user_space_completion', true)
      } else if (params.spaceCompletionStatus.isNotCompleted.isTrue) {
        query = query.eq('verify_user_space_completion', false)
      }

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

      return query.order('created_at', { ascending: false }).range(range.from, range.to)
    }

    const fullSelect = `*,
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
      users_upvoted_comments(comment_id)`

    const fallbackSelect = `*,
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
      users_upvoted_comments(comment_id)`

    let { data, count, error } = await buildQuery(fullSelect)

    if (this.shouldFallbackUserSelect(error) && params.insigniaRoles.length === 0) {
      const fallbackResponse = await buildQuery(fallbackSelect)
      data = fallbackResponse.data
      count = fallbackResponse.count
      error = fallbackResponse.error
    }

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const supabaseUsers = (data ?? []) as unknown as SupabaseUser[]

    const users = supabaseUsers.map((user) =>
      SupabaseUserMapper.toEntity(this.normalizeSupabaseUser(user)),
    )

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

  async addMany(users: User[]): Promise<void> {
    if (users.length === 0) {
      return
    }

    const supabaseUsers = users.map((user) => {
      const supabaseUser = SupabaseUserMapper.toSupabase(user)

      return {
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
      }
    })

    const { error } = await this.supabase.from('users').insert(supabaseUsers)

    if (error) {
      throw new SupabasePostgreError(error)
    }
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
}
