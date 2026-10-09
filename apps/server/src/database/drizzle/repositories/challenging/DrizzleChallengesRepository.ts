import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  inArray,
  isNull,
  lte,
  ne,
  notInArray,
  or,
  sql,
  type SQL,
} from 'drizzle-orm'
import { type Challenge, ChallengeCategory } from '@stardust/core/challenging/entities'
import { ChallengeNavigation, ChallengeVote } from '@stardust/core/challenging/structures'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import type { ChallengesListParams } from '@stardust/core/challenging/types'
import { Integer, type Id, type Slug, type Month } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import { AuthError } from '@stardust/core/global/errors'
import type { DrizzleTransaction } from '../../DrizzleClient'
import { DrizzleRepository } from '../../DrizzleRepository'
import { challengeModel } from '../../models/challenging/challenge-model'
import { challengeCategoryModel } from '../../models/challenging/challenge-category-model'
import { categoryModel } from '../../models/challenging/category-model'
import { starModel } from '../../models/space/star-model'
import { userModel } from '../../models/profile/user-model'
import { avatarModel } from '../../models/shop/avatar-model'
import { userChallengeVoteModel } from '../../models/profile/user-challenge-vote-model'
import { userCompletedChallengeModel } from '../../models/profile/user-completed-challenge-model'
import { DrizzleChallengeMapper } from '../../mappers/challenging/DrizzleChallengeMapper'
import type { DrizzleChallenge } from '../../types/entities/challenging'

export class DrizzleChallengesRepository
  extends DrizzleRepository
  implements ChallengesRepository
{
  private authorizeOwner(userId: Id): void {
    if (
      this.access.kind === 'public' ||
      (this.access.kind === 'user' && this.access.accountId.value !== userId.value)
    )
      throw new AuthError('Conta não autorizada')
  }

  private visibility(starContent = false): SQL | undefined {
    if (this.access.kind === 'god' || this.access.kind === 'system') return undefined
    return this.nonAdminVisibility(starContent)
  }

  private nonAdminVisibility(starContent: boolean) {
    return or(
      eq(challengeModel.isPublic, true),
      this.ownerCondition(),
      starContent ? this.availableStarContent() : undefined,
    )
  }

  private availableStarContent() {
    return inArray(challengeModel.starId, this.availableStarsQuery())
  }

  private availableStarsQuery() {
    return this.database
      .select({ id: starModel.id })
      .from(starModel)
      .where(eq(starModel.isAvailable, true))
  }

  private ownerCondition(): SQL | undefined {
    return this.access.kind === 'user'
      ? eq(challengeModel.userId, this.access.accountId.value)
      : undefined
  }

  private voteCount(vote: 'upvote' | 'downvote') {
    return sql<number>`(select count(*)::integer from ${userChallengeVoteModel} where ${userChallengeVoteModel.challengeId} = ${challengeModel.id} and ${userChallengeVoteModel.vote} = ${vote})`
  }

  private completionCount() {
    return sql<number>`(select count(*)::integer from ${userCompletedChallengeModel} where ${userCompletedChallengeModel.challengeId} = ${challengeModel.id})`
  }

  private authorColumns() {
    return {
      authorId: userModel.id,
      authorName: userModel.name,
      authorSlug: userModel.slug,
      authorAvatarName: avatarModel.name,
      authorAvatarImage: avatarModel.image,
    }
  }

  private readColumns(detail: boolean) {
    return {
      ...getTableColumns(challengeModel),
      officialSolution: detail ? challengeModel.officialSolution : sql<unknown>`null`,
      ...this.authorColumns(),
      ...this.engagementColumns(),
      categories: this.categoriesProjection(),
    }
  }

  private engagementColumns() {
    return {
      upvotesCount: this.voteCount('upvote'),
      downvotesCount: this.voteCount('downvote'),
      totalCompletitions: this.completionCount(),
    }
  }

  private categoriesProjection() {
    const { id, name } = categoryModel
    const { categoryId, challengeId } = challengeCategoryModel
    return sql<
      DrizzleChallenge['categories']
    >`coalesce((select json_agg(json_build_object('id', ${id}, 'name', ${name})) from ${challengeCategoryModel} join ${categoryModel} on ${id} = ${categoryId} where ${challengeId} = ${challengeModel.id}), '[]'::json)`
  }

  private query(detail = true) {
    return this.database
      .select(this.readColumns(detail))
      .from(challengeModel)
      .leftJoin(userModel, eq(userModel.id, challengeModel.userId))
      .leftJoin(avatarModel, eq(avatarModel.id, userModel.avatarId))
  }

  private async findOne(filter: SQL, starContent = false): Promise<Challenge | null> {
    return this.findOneResult(
      async () =>
        this.query()
          .where(and(filter, this.visibility(starContent)))
          .limit(1),
      DrizzleChallengeMapper.toEntity,
    )
  }

  async findById(challengeId: Id): Promise<Challenge | null> {
    return this.findOne(eq(challengeModel.id, challengeId.value), true)
  }

  async findBySlug(challengeSlug: Slug): Promise<Challenge | null> {
    return this.findOne(eq(challengeModel.slug, challengeSlug.value), true)
  }

  async findByStar(starId: Id): Promise<Challenge | null> {
    return this.findOne(eq(challengeModel.starId, starId.value), true)
  }

  async findAllByNotAuthor(authorId: Id): Promise<Challenge[]> {
    return this.findManyResults(
      async () =>
        this.query().where(
          and(ne(challengeModel.userId, authorId.value), this.visibility()),
        ),
      DrizzleChallengeMapper.toEntity,
    )
  }

  async findChallengeNavigationBySlug(
    challengeSlug: Slug,
  ): Promise<ChallengeNavigation | null> {
    return this.executeQuery(async () => {
      const rows = await this.navigationQuery()
      const index = rows.findIndex((row) => row.slug === challengeSlug.value)
      return index < 0 ? null : this.navigationAtIndex(rows, index)
    })
  }

  private navigationQuery() {
    return this.database
      .select({ slug: challengeModel.slug })
      .from(challengeModel)
      .where(and(isNull(challengeModel.starId), this.visibility()))
      .orderBy(asc(challengeModel.createdAt), asc(challengeModel.id))
  }

  private navigationAtIndex(
    rows: Awaited<ReturnType<DrizzleChallengesRepository['navigationQuery']>>,
    index: number,
  ): ChallengeNavigation {
    return ChallengeNavigation.create({
      previousChallengeSlug: rows[index - 1]?.slug ?? null,
      nextChallengeSlug: rows[index + 1]?.slug ?? null,
    })
  }

  private listingFilter(params: ChallengesListParams): SQL | undefined {
    return and(
      this.listingVisibility(params),
      this.publicationFilter(params),
      this.exerciseFilter(params),
      this.categoryFilter(params),
      this.completionFilter(params),
    )
  }

  private publicationFilter(params: ChallengesListParams) {
    return and(
      params.shouldIncludeStarChallenges.isTrue
        ? undefined
        : isNull(challengeModel.starId),
      this.authorOnlyFilter(params),
    )
  }

  private authorOnlyFilter(params: ChallengesListParams) {
    return params.shouldIncludeOnlyAuthorChallenges.isTrue
      ? params.userId
        ? eq(challengeModel.userId, params.userId.value)
        : sql`false`
      : undefined
  }

  private exerciseFilter({
    title,
    difficulty: { level },
    isNewStatus: { value: newStatus },
  }: ChallengesListParams) {
    return and(
      title.isEmpty.isTrue ? undefined : ilike(challengeModel.title, `%${title.value}%`),
      level === 'all' ? undefined : eq(challengeModel.difficultyLevel, level),
      newStatus === 'all' ? undefined : eq(challengeModel.isNew, newStatus === 'new'),
    )
  }

  private listingVisibility(params: ChallengesListParams): SQL | undefined {
    return params.shouldIncludePrivateChallenges.isTrue
      ? this.visibility()
      : this.publicListingVisibility()
  }

  private publicListingVisibility() {
    return or(eq(challengeModel.isPublic, true), this.publicListingOwnerCondition())
  }

  private publicListingOwnerCondition() {
    return this.access.kind === 'user' || this.access.kind === 'god'
      ? eq(challengeModel.userId, this.access.accountId.value)
      : undefined
  }

  private categoryFilter(params: ChallengesListParams): SQL | undefined {
    return params.categoriesIds.dto.length
      ? inArray(challengeModel.id, this.categoryChallengeIdsQuery(params))
      : undefined
  }

  private categoryChallengeIdsQuery(params: ChallengesListParams) {
    return this.database
      .select({ id: challengeCategoryModel.challengeId })
      .from(challengeCategoryModel)
      .where(inArray(challengeCategoryModel.categoryId, params.categoriesIds.dto))
  }

  private completionFilter({
    completedChallengesIds,
    completionStatus,
  }: ChallengesListParams): SQL | undefined {
    const completed = completedChallengesIds.dto
    if (completionStatus.value === 'completed') return this.completedMembership(completed)
    return completionStatus.value === 'not-completed' && completed.length
      ? notInArray(challengeModel.id, completed)
      : undefined
  }

  private completedMembership(
    completed: ChallengesListParams['completedChallengesIds']['dto'],
  ) {
    return completed.length ? inArray(challengeModel.id, completed) : sql`false`
  }

  private listingOrder(params: ChallengesListParams): SQL[] {
    const orders: SQL[] = [asc(challengeModel.difficultyLevel)]
    this.appendListingOrders(orders, params)
    return orders
  }

  private appendListingOrders(orders: SQL[], params: ChallengesListParams): void {
    for (const [order, column] of this.orderingCriteria(params)) {
      if (order.isAscending.isTrue) orders.push(asc(column))
      else if (order.isDescending.isTrue) orders.push(desc(column))
    }
  }

  private orderingCriteria(params: ChallengesListParams) {
    return [
      [params.postingOrder, challengeModel.createdAt],
      [params.upvotesCountOrder, this.voteCount('upvote')],
      [params.downvoteCountOrder, this.voteCount('downvote')],
      [params.completionCountOrder, this.completionCount()],
    ] as const
  }

  async findMany(params: ChallengesListParams): Promise<ManyItems<Challenge>> {
    return this.executeQuery(() => this.listPage(params))
  }

  private pageRowsQuery(filter: SQL | undefined, params: ChallengesListParams) {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
    return this.orderedChallengesQuery(filter, params)
      .offset(range.offset)
      .limit(range.limit)
  }

  private orderedChallengesQuery(filter: SQL | undefined, params: ChallengesListParams) {
    return this.query(false)
      .where(filter)
      .orderBy(...this.listingOrder(params))
  }

  private countQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(challengeModel)
      .where(filter)
  }

  private async listPage(params: ChallengesListParams): Promise<ManyItems<Challenge>> {
    const filter = this.listingFilter(params)
    const [rows, [total]] = await Promise.all([
      this.pageRowsQuery(filter, params),
      this.countQuery(filter),
    ])
    return this.mapPage(rows, total)
  }

  private mapPage(
    rows: Awaited<ReturnType<DrizzleChallengesRepository['pageRowsQuery']>>,
    total:
      | Awaited<ReturnType<DrizzleChallengesRepository['countQuery']>>[number]
      | undefined,
  ): ManyItems<Challenge> {
    return { items: rows.map(DrizzleChallengeMapper.toEntity), count: total?.count ?? 0 }
  }

  async findAllCategories(): Promise<ChallengeCategory[]> {
    return this.executeQuery(async () => {
      const rows = await this.database
        .select()
        .from(categoryModel)
        .orderBy(asc(categoryModel.name))
      return rows.map((row) => ChallengeCategory.create({ id: row.id, name: row.name }))
    })
  }

  private voteFilter(challengeId: Id, userId: Id) {
    return and(
      eq(userChallengeVoteModel.challengeId, challengeId.value),
      eq(userChallengeVoteModel.userId, userId.value),
    )
  }

  private voteQuery(challengeId: Id, userId: Id) {
    return this.database
      .select({ vote: userChallengeVoteModel.vote })
      .from(userChallengeVoteModel)
      .where(this.voteFilter(challengeId, userId))
      .limit(1)
  }

  async findVoteByChallengeAndUser(challengeId: Id, userId: Id): Promise<ChallengeVote> {
    this.authorizeOwner(userId)
    return this.executeQuery(async () => {
      const [row] = await this.voteQuery(challengeId, userId)
      return ChallengeVote.create(row?.vote ?? 'none')
    })
  }

  async add(challenge: Challenge): Promise<void> {
    this.authorizeOwner(challenge.author.id)
    await this.executeQuery(async () => {
      await this.database.transaction(async (transaction) => {
        await transaction
          .insert(challengeModel)
          .values(DrizzleChallengeMapper.toPersistence(challenge))
        await this.insertCategories(transaction, challenge)
      })
    })
  }

  async replace(challenge: Challenge): Promise<void> {
    this.authorizeOwner(challenge.author.id)
    await this.executeQuery(async () =>
      this.database.transaction((transaction) =>
        this.replaceChallenge(transaction, challenge),
      ),
    )
  }

  private async replaceChallenge(
    transaction: DrizzleTransaction,
    challenge: Challenge,
  ): Promise<void> {
    const rows = await this.updateChallengeQuery(transaction, challenge)
    if (!rows.length) return
    await this.deleteCategoriesQuery(transaction, challenge)
    await this.insertCategories(transaction, challenge)
  }

  private updateChallengeQuery(transaction: DrizzleTransaction, challenge: Challenge) {
    return transaction
      .update(challengeModel)
      .set(DrizzleChallengeMapper.toPersistence(challenge))
      .where(and(eq(challengeModel.id, challenge.id.value), this.ownerCondition()))
      .returning({ id: challengeModel.id })
  }

  private deleteCategoriesQuery(transaction: DrizzleTransaction, challenge: Challenge) {
    return transaction
      .delete(challengeCategoryModel)
      .where(eq(challengeCategoryModel.challengeId, challenge.id.value))
  }

  private async insertCategories(
    transaction: DrizzleTransaction,
    challenge: Challenge,
  ): Promise<void> {
    if (!challenge.categories.length) return
    await transaction.insert(challengeCategoryModel).values(
      challenge.categories.map((category) => ({
        challengeId: challenge.id.value,
        categoryId: category.id.value,
      })),
    )
  }

  async remove(challenge: Challenge): Promise<void> {
    this.authorizeOwner(challenge.author.id)
    await this.executeQuery(async () => {
      await this.database
        .delete(challengeModel)
        .where(and(eq(challengeModel.id, challenge.id.value), this.ownerCondition()))
    })
  }

  async addVote(challengeId: Id, userId: Id, vote: ChallengeVote): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database.insert(userChallengeVoteModel).values({
        challengeId: challengeId.value,
        userId: userId.value,
        vote: vote.value === 'upvote' ? 'upvote' : 'downvote',
      })
    })
  }

  async replaceVote(challengeId: Id, userId: Id, vote: ChallengeVote): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database
        .update(userChallengeVoteModel)
        .set({ vote: vote.value === 'upvote' ? 'upvote' : 'downvote' })
        .where(this.voteFilter(challengeId, userId))
    })
  }

  async removeVote(challengeId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database
        .delete(userChallengeVoteModel)
        .where(this.voteFilter(challengeId, userId))
    })
  }

  private async count(filter?: SQL): Promise<Integer> {
    return this.executeQuery(async () => {
      const [row] = await this.database
        .select({ count: sql<number>`count(*)::integer` })
        .from(challengeModel)
        .where(and(filter, this.visibility()))
      return Integer.create(row?.count ?? 0)
    })
  }

  async countPublicChallenges(): Promise<Integer> {
    return this.count(
      and(eq(challengeModel.isPublic, true), isNull(challengeModel.starId)),
    )
  }

  async countAll(): Promise<Integer> {
    return this.count()
  }

  async countByMonth(month: Month): Promise<Integer> {
    return this.count(
      and(
        gte(challengeModel.createdAt, month.firstDay),
        lte(challengeModel.createdAt, month.lastDay),
      ),
    )
  }

  async expireNewChallengesOlderThanOneWeek(): Promise<void> {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
    await this.executeQuery(async () => this.expirationQuery())
  }

  private expiredNewFilter() {
    return and(
      eq(challengeModel.isNew, true),
      lte(challengeModel.createdAt, new Date(Date.now() - 7 * 86400000)),
    )
  }

  private expirationQuery() {
    return this.database
      .update(challengeModel)
      .set({ isNew: false })
      .where(this.expiredNewFilter())
  }
}
