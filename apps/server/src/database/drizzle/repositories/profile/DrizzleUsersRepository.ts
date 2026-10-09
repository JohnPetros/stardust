import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  inArray,
  lte,
  sql,
  type SQL,
  type SQLWrapper,
} from 'drizzle-orm'
import type { User } from '@stardust/core/profile/entities'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { UsersListingParams } from '@stardust/core/profile/types'
import {
  Integer,
  IdsList,
  Logical,
  type Id,
  type Slug,
  type Name,
  type Email,
  type Month,
  type InsigniaRole,
} from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import type { DrizzleTransaction } from '../../DrizzleClient'
import {
  userModel,
  userUnlockedStarModel,
  userRecentlyUnlockedStarModel,
  userUnlockedAchievementModel,
  userRescuableAchievementModel,
  userAcquiredRocketModel,
  userAcquiredAvatarModel,
  userCompletedChallengeModel,
  userUpvotedSolutionModel,
  userUpvotedCommentModel,
  userAcquiredInsigniaModel,
} from '../../models/profile'
import { avatarModel } from '../../models/shop/avatar-model'
import { rocketModel } from '../../models/shop/rocket-model'
import { insigniaModel } from '../../models/shop/insignia-model'
import { tierModel } from '../../models/ranking/tier-model'
import { starModel } from '../../models/space/star-model'
import { planetModel } from '../../models/space/planet-model'
import { DrizzleUserMapper } from '../../mappers/profile/DrizzleUserMapper'
import type { DrizzleUser } from '../../types/entities/profile'

type StarUnlockTable = typeof userUnlockedStarModel | typeof userRecentlyUnlockedStarModel

export class DrizzleUsersRepository extends DrizzleRepository implements UsersRepository {
  private authorize(): void {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
  }

  private authorizeOwner(userId: Id): void {
    this.authorize()
    if (this.access.kind === 'user' && this.access.accountId.value !== userId.value)
      throw new AuthError('Conta não autorizada')
  }

  private query() {
    return this.baseQuery()
      .leftJoin(avatarModel, eq(avatarModel.id, userModel.avatarId))
      .leftJoin(rocketModel, eq(rocketModel.id, userModel.rocketId))
      .leftJoin(tierModel, eq(tierModel.id, userModel.tierId))
  }

  private baseQuery() {
    return this.database.select(this.readColumns()).from(userModel)
  }

  private readColumns() {
    return {
      ...getTableColumns(userModel),
      ...this.appearanceSelection(),
      ...this.progressSelection(),
      ...this.collectionSelection(),
    }
  }

  private appearanceSelection() {
    return {
      avatar: getTableColumns(avatarModel),
      rocket: getTableColumns(rocketModel),
      tier: getTableColumns(tierModel),
    }
  }

  private relationshipProjection<K extends keyof DrizzleUser>(
    key: K & keyof typeof relationshipMetadata,
  ): SQL<DrizzleUser[K]> {
    const { table, jsonKey, column, owner } = relationshipMetadata[key]
    return sql<
      DrizzleUser[K]
    >`coalesce((select json_agg(json_build_object(${jsonKey}::text, ${column})) from ${table} where ${owner} = ${userModel.id}), '[]'::json)`
  }

  private progressSelection() {
    return {
      ...this.starProgressSelection(),
      ...this.achievementProgressSelection(),
    }
  }

  private starProgressSelection() {
    return {
      usersUnlockedStars: this.relationshipProjection('usersUnlockedStars'),
      usersRecentlyUnlockedStars: this.relationshipProjection(
        'usersRecentlyUnlockedStars',
      ),
    }
  }

  private achievementProgressSelection() {
    return {
      usersUnlockedAchievements: this.relationshipProjection('usersUnlockedAchievements'),
      usersRescuableAchievements: this.relationshipProjection(
        'usersRescuableAchievements',
      ),
    }
  }

  private collectionSelection() {
    return {
      ...this.acquisitionSelection(),
      ...this.endorsementSelection(),
      ...this.completionSelection(),
      ...this.insigniaSelection(),
    }
  }

  private acquisitionSelection() {
    return {
      usersAcquiredRockets: this.relationshipProjection('usersAcquiredRockets'),
      usersAcquiredAvatars: this.relationshipProjection('usersAcquiredAvatars'),
    }
  }

  private endorsementSelection() {
    return {
      usersUpvotedSolutions: this.relationshipProjection('usersUpvotedSolutions'),
      usersUpvotedComments: this.relationshipProjection('usersUpvotedComments'),
    }
  }

  private completionSelection() {
    return {
      usersCompletedChallenges: this.relationshipProjection('usersCompletedChallenges'),
      usersCompletedPlanets: sql<
        DrizzleUser['usersCompletedPlanets']
      >`coalesce((select json_agg(json_build_object('planetId', completed.planet_id)) from public.users_completed_planets_view completed where completed.user_id = ${userModel.id}), '[]'::json)`,
    }
  }

  private insigniaSelection() {
    const { id, role } = insigniaModel
    const { insigniaId, userId } = userAcquiredInsigniaModel
    return {
      insignias: sql<
        DrizzleUser['insignias']
      >`coalesce((select json_agg(json_build_object('role', ${role})) from ${userAcquiredInsigniaModel} join ${insigniaModel} on ${id} = ${insigniaId} where ${userId} = ${userModel.id}), '[]'::json)`,
    }
  }

  private async findOne(filter: SQL): Promise<User | null> {
    this.authorize()
    return this.findOneResult(
      async () => this.query().where(filter).limit(1),
      DrizzleUserMapper.toEntity,
    )
  }

  async findById(id: Id): Promise<User | null> {
    this.authorize()
    return this.findOne(this.accountVisibility(id))
  }

  private accountVisibility(id: Id) {
    return this.access.kind === 'user'
      ? sql`${userModel.id} = ${id.value} and ${userModel.id} = ${this.access.accountId.value}`
      : eq(userModel.id, id.value)
  }

  async findBySlug(slug: Slug): Promise<User | null> {
    return this.findOne(eq(userModel.slug, slug.value))
  }

  async findByName(name: Name): Promise<User | null> {
    return this.findOneResult(
      async () => this.query().where(eq(userModel.name, name.value)).limit(1),
      DrizzleUserMapper.toEntity,
    )
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.findOneResult(
      async () => this.query().where(eq(userModel.email, email.value)).limit(1),
      DrizzleUserMapper.toEntity,
    )
  }

  async findByGoogleAccountId(_googleAccountId: Id): Promise<User | null> {
    this.authorize()
    // O catálogo legado não persiste associação de conta Google em public.users.
    return null
  }

  async findByGithubAccountId(_githubAccountId: Id): Promise<User | null> {
    this.authorize()
    // O catálogo legado não persiste associação de conta GitHub em public.users.
    return null
  }

  async findByIdsList(idsList: IdsList): Promise<User[]> {
    this.authorize()
    if (!idsList.dto.length) return []
    return this.findManyResults(
      async () => this.query().where(inArray(userModel.id, idsList.dto)),
      DrizzleUserMapper.toEntity,
    )
  }

  async findByTierOrderedByXp(tierId: Id): Promise<User[]> {
    this.authorize()
    return this.findManyResults(
      async () =>
        this.query()
          .where(eq(userModel.tierId, tierId.value))
          .orderBy(desc(userModel.xp)),
      DrizzleUserMapper.toEntity,
    )
  }

  async findAll(): Promise<User[]> {
    this.authorize()
    return this.findManyResults(async () => this.query(), DrizzleUserMapper.toEntity)
  }

  private listingFilter(params: UsersListingParams): SQL | undefined {
    return and(
      this.identityFilter(params),
      this.creationFilter(params),
      this.insigniaFilter(params),
      this.spaceCompletionFilter(params),
    )
  }

  private identityFilter(params: UsersListingParams) {
    return params.search && params.search.value.length > 1
      ? ilike(userModel.name, `%${params.search.value}%`)
      : undefined
  }

  private creationFilter({ creationPeriod }: UsersListingParams) {
    return and(
      creationPeriod ? gte(userModel.createdAt, creationPeriod.startDate) : undefined,
      creationPeriod ? lte(userModel.createdAt, creationPeriod.endDate) : undefined,
    )
  }

  private insigniaFilter(params: UsersListingParams) {
    return params.insigniaRoles.length
      ? inArray(userModel.id, this.insigniaUsersQuery(params))
      : undefined
  }

  private acquiredInsigniaUsersQuery() {
    return this.database
      .select({ id: userAcquiredInsigniaModel.userId })
      .from(userAcquiredInsigniaModel)
      .innerJoin(
        insigniaModel,
        eq(insigniaModel.id, userAcquiredInsigniaModel.insigniaId),
      )
  }

  private insigniaUsersQuery(params: UsersListingParams) {
    return this.acquiredInsigniaUsersQuery().where(
      inArray(
        insigniaModel.role,
        params.insigniaRoles.map((role) => role.value),
      ),
    )
  }

  private spaceCompletionFilter(params: UsersListingParams) {
    return params.spaceCompletionStatus.isCompleted.isTrue
      ? sql`public.verify_user_space_completion(${userModel}) = true`
      : params.spaceCompletionStatus.isNotCompleted.isTrue
        ? sql`public.verify_user_space_completion(${userModel}) = false`
        : undefined
  }

  private listingOrder(params: UsersListingParams): SQL[] {
    const orders: SQL[] = []
    this.appendListingOrders(orders, params)
    orders.push(desc(userModel.createdAt))
    return orders
  }

  private appendListingOrders(orders: SQL[], params: UsersListingParams): void {
    for (const [order, column] of this.orderingCriteria(params)) {
      if (order.isAscending.isTrue) orders.push(asc(column))
      else if (order.isDescending.isTrue) orders.push(desc(column))
    }
  }

  private progressCountColumns() {
    return {
      unlockedStars: sql`public.count_user_unlocked_stars(${userModel})`,
      unlockedAchievements: sql`public.count_user_unlocked_achievements(${userModel})`,
      completedChallenges: sql`public.count_user_completed_challenges(${userModel})`,
    }
  }

  private orderingCriteria(params: UsersListingParams) {
    const counts = this.progressCountColumns()
    return [
      ...this.performanceOrders(params),
      ...this.relationCountOrders(params, counts),
    ]
  }

  private performanceOrders(params: UsersListingParams) {
    return [
      [params.levelOrder, userModel.level],
      [params.weeklyXpOrder, userModel.weeklyXp],
    ] satisfies readonly (readonly [UsersListingParams['levelOrder'], SQLWrapper])[]
  }

  private relationCountOrders(
    params: UsersListingParams,
    counts: ReturnType<DrizzleUsersRepository['progressCountColumns']>,
  ) {
    return [
      [params.unlockedStarCountOrder, counts.unlockedStars],
      [params.unlockedAchievementCountOrder, counts.unlockedAchievements],
      [params.completedChallengeCountOrder, counts.completedChallenges],
    ] satisfies readonly (readonly [UsersListingParams['levelOrder'], SQLWrapper])[]
  }

  async findMany(params: UsersListingParams): Promise<ManyItems<User>> {
    this.authorize()
    return this.executeQuery(() => this.listPage(params))
  }

  private orderedUsersQuery(filter: SQL | undefined, params: UsersListingParams) {
    return this.query()
      .where(filter)
      .orderBy(...this.listingOrder(params))
  }

  private pageRowsQuery(filter: SQL | undefined, params: UsersListingParams) {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
    return this.orderedUsersQuery(filter, params).offset(range.offset).limit(range.limit)
  }

  private async listPage(params: UsersListingParams): Promise<ManyItems<User>> {
    const filter = this.listingFilter(params)
    const [rows, [total]] = await Promise.all([
      this.pageRowsQuery(filter, params),
      this.countQuery(userModel, filter),
    ])
    return this.mapPage(rows, total)
  }

  private mapPage(
    rows: Awaited<ReturnType<DrizzleUsersRepository['pageRowsQuery']>>,
    total: Awaited<ReturnType<DrizzleUsersRepository['countQuery']>>[number] | undefined,
  ): ManyItems<User> {
    return { items: rows.map(DrizzleUserMapper.toEntity), count: total?.count ?? 0 }
  }

  private exists(filter: SQL): Promise<Logical> {
    return this.executeQuery(async () => {
      const rows = await this.database
        .select({ id: userModel.id })
        .from(userModel)
        .where(filter)
        .limit(2)
      return Logical.create(rows.length === 1)
    })
  }

  async containsWithEmail(email: Email): Promise<Logical> {
    return this.exists(ilike(userModel.email, `%${email.value}%`))
  }

  async containsWithName(name: Name): Promise<Logical> {
    return this.exists(ilike(userModel.name, `%${name.value}%`))
  }

  async add(user: User): Promise<void> {
    this.authorizeOwner(user.id)
    await this.executeQuery(async () => {
      await this.database.insert(userModel).values(DrizzleUserMapper.toPersistence(user))
    })
  }

  async addMany(users: User[]): Promise<void> {
    for (const user of users) this.authorizeOwner(user.id)
    this.authorize()
    if (!users.length) return
    await this.executeQuery(async () => this.insertUsersQuery(users))
  }

  private insertUsersQuery(users: User[]) {
    return this.database
      .insert(userModel)
      .values(users.map(DrizzleUserMapper.toPersistence))
  }

  async replace(user: User): Promise<void> {
    await this.replaceMany([user])
  }

  async replaceMany(users: User[]): Promise<void> {
    this.authorize()
    for (const user of users) this.authorizeOwner(user.id)
    await this.executeQuery(async () =>
      this.database.transaction((transaction) => this.persistUsers(transaction, users)),
    )
  }

  private async persistUsers(
    transaction: DrizzleTransaction,
    users: User[],
  ): Promise<void> {
    for (const user of users) await this.updateUserQuery(transaction, user)
  }

  private updateUserQuery(transaction: DrizzleTransaction, user: User) {
    return transaction
      .update(userModel)
      .set(DrizzleUserMapper.toPersistence(user))
      .where(eq(userModel.id, user.id.value))
  }

  async addAcquiredAvatar(avatarId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database
        .insert(userAcquiredAvatarModel)
        .values({ userId: userId.value, avatarId: avatarId.value })
    })
  }

  async addAcquiredRocket(rocketId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database
        .insert(userAcquiredRocketModel)
        .values({ userId: userId.value, rocketId: rocketId.value })
    })
  }

  async addUnlockedStar(starId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database
        .insert(userUnlockedStarModel)
        .values({ userId: userId.value, starId: starId.value })
    })
  }

  async addRecentlyUnlockedStar(starId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database
        .insert(userRecentlyUnlockedStarModel)
        .values({ userId: userId.value, starId: starId.value })
    })
  }

  async addUpvotedComment(commentId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database
        .insert(userUpvotedCommentModel)
        .values({ userId: userId.value, commentId: commentId.value })
    })
  }

  async addUnlockedAchievement(achievementId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database
        .insert(userUnlockedAchievementModel)
        .values({ userId: userId.value, achievementId: achievementId.value })
    })
  }

  async addRescuableAchievement(achievementId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database
        .insert(userRescuableAchievementModel)
        .values({ userId: userId.value, achievementId: achievementId.value })
    })
  }

  async addCompletedChallenge(challengeId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database
        .insert(userCompletedChallengeModel)
        .values({ userId: userId.value, challengeId: challengeId.value })
    })
  }

  async removeRecentlyUnlockedStar(starId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () =>
      this.database
        .delete(userRecentlyUnlockedStarModel)
        .where(
          this.relationshipFilter(
            userRecentlyUnlockedStarModel.userId,
            userRecentlyUnlockedStarModel.starId,
            userId,
            starId,
          ),
        ),
    )
  }

  async removeUpvotedComment(commentId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () =>
      this.database
        .delete(userUpvotedCommentModel)
        .where(
          this.relationshipFilter(
            userUpvotedCommentModel.userId,
            userUpvotedCommentModel.commentId,
            userId,
            commentId,
          ),
        ),
    )
  }

  async removeRescuableAchievement(achievementId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () =>
      this.database
        .delete(userRescuableAchievementModel)
        .where(
          this.relationshipFilter(
            userRescuableAchievementModel.userId,
            userRescuableAchievementModel.achievementId,
            userId,
            achievementId,
          ),
        ),
    )
  }

  private relationshipFilter(
    owner: SQLWrapper,
    item: SQLWrapper,
    userId: Id,
    itemId: Id,
  ) {
    return and(eq(owner, userId.value), eq(item, itemId.value))
  }

  async addAcquiredInsignia(insigniaRole: InsigniaRole, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () =>
      this.database.transaction((transaction) =>
        this.acquireInsignia(transaction, insigniaRole, userId),
      ),
    )
  }

  private insigniaQuery(transaction: DrizzleTransaction, insigniaRole: InsigniaRole) {
    return transaction
      .select({ id: insigniaModel.id })
      .from(insigniaModel)
      .where(eq(insigniaModel.role, insigniaRole.value))
      .limit(1)
  }

  private async acquireInsignia(
    transaction: DrizzleTransaction,
    insigniaRole: InsigniaRole,
    userId: Id,
  ): Promise<void> {
    const [row] = await this.insigniaQuery(transaction, insigniaRole)
    if (!row) throw new AuthError('Conta não autorizada')
    await transaction
      .insert(userAcquiredInsigniaModel)
      .values({ userId: userId.value, insigniaId: row.id })
  }

  async findUnlockedStars(userId: Id): Promise<IdsList> {
    this.authorizeOwner(userId)
    return this.unlockedStarIds(userUnlockedStarModel, userId)
  }

  async findRecentlyUnlockedStars(userId: Id): Promise<IdsList> {
    this.authorizeOwner(userId)
    return this.unlockedStarIds(userRecentlyUnlockedStarModel, userId)
  }

  private starProgressQuery(table: StarUnlockTable) {
    return this.database
      .select({ starId: table.starId })
      .from(table)
      .innerJoin(starModel, eq(starModel.id, table.starId))
      .innerJoin(planetModel, eq(planetModel.id, starModel.planetId))
  }

  private orderedStarProgressQuery(table: StarUnlockTable, userId: Id) {
    return this.starProgressQuery(table)
      .where(eq(table.userId, userId.value))
      .orderBy(asc(planetModel.position), asc(starModel.number))
  }

  private unlockedStarIds(table: StarUnlockTable, userId: Id): Promise<IdsList> {
    return this.executeQuery(async () => {
      const rows = await this.orderedStarProgressQuery(table, userId)
      return IdsList.create(rows.map((row) => row.starId))
    })
  }

  private countQuery(
    table:
      | typeof userModel
      | typeof userCompletedChallengeModel
      | typeof userUnlockedStarModel,
    filter?: SQL,
  ) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(table)
      .where(filter)
  }

  private countResult(
    query: ReturnType<DrizzleUsersRepository['countQuery']>,
  ): Promise<Integer> {
    return this.executeQuery(async () => {
      const [row] = await query
      return Integer.create(row?.count ?? 0)
    })
  }

  async countAll(): Promise<Integer> {
    this.authorize()
    return this.countResult(this.countQuery(userModel))
  }

  async countByMonth(month: Month): Promise<Integer> {
    this.authorize()
    return this.countInMonth(userModel, month)
  }

  async countAllCompletedChallenges(): Promise<Integer> {
    this.authorize()
    return this.countResult(this.countQuery(userCompletedChallengeModel))
  }

  async countCompletedChallengesByMonth(month: Month): Promise<Integer> {
    this.authorize()
    return this.countInMonth(userCompletedChallengeModel, month)
  }

  async countAllUnlockedStars(): Promise<Integer> {
    this.authorize()
    return this.countResult(this.countQuery(userUnlockedStarModel))
  }

  async countUnlockedStarsByMonth(month: Month): Promise<Integer> {
    this.authorize()
    return this.countInMonth(userUnlockedStarModel, month)
  }

  private monthFilter(createdAt: SQLWrapper, month: Month) {
    return and(gte(createdAt, month.firstDay), lte(createdAt, month.lastDay))
  }

  private countInMonth(
    table: Parameters<DrizzleUsersRepository['countQuery']>[0],
    month: Month,
  ): Promise<Integer> {
    return this.countResult(
      this.countQuery(table, this.monthFilter(table.createdAt, month)),
    )
  }
}

const relationshipMetadata = {
  usersUnlockedStars: {
    table: userUnlockedStarModel,
    jsonKey: 'starId',
    column: userUnlockedStarModel.starId,
    owner: userUnlockedStarModel.userId,
  },
  usersRecentlyUnlockedStars: {
    table: userRecentlyUnlockedStarModel,
    jsonKey: 'starId',
    column: userRecentlyUnlockedStarModel.starId,
    owner: userRecentlyUnlockedStarModel.userId,
  },
  usersUnlockedAchievements: {
    table: userUnlockedAchievementModel,
    jsonKey: 'achievementId',
    column: userUnlockedAchievementModel.achievementId,
    owner: userUnlockedAchievementModel.userId,
  },
  usersRescuableAchievements: {
    table: userRescuableAchievementModel,
    jsonKey: 'achievementId',
    column: userRescuableAchievementModel.achievementId,
    owner: userRescuableAchievementModel.userId,
  },
  usersAcquiredRockets: {
    table: userAcquiredRocketModel,
    jsonKey: 'rocketId',
    column: userAcquiredRocketModel.rocketId,
    owner: userAcquiredRocketModel.userId,
  },
  usersAcquiredAvatars: {
    table: userAcquiredAvatarModel,
    jsonKey: 'avatarId',
    column: userAcquiredAvatarModel.avatarId,
    owner: userAcquiredAvatarModel.userId,
  },
  usersUpvotedSolutions: {
    table: userUpvotedSolutionModel,
    jsonKey: 'solutionId',
    column: userUpvotedSolutionModel.solutionId,
    owner: userUpvotedSolutionModel.userId,
  },
  usersUpvotedComments: {
    table: userUpvotedCommentModel,
    jsonKey: 'commentId',
    column: userUpvotedCommentModel.commentId,
    owner: userUpvotedCommentModel.userId,
  },
  usersCompletedChallenges: {
    table: userCompletedChallengeModel,
    jsonKey: 'challengeId',
    column: userCompletedChallengeModel.challengeId,
    owner: userCompletedChallengeModel.userId,
  },
}
