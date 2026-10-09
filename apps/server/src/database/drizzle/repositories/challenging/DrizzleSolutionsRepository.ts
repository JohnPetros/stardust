import { and, desc, eq, getTableColumns, ilike, sql, type SQL } from 'drizzle-orm'
import type { Solution } from '@stardust/core/challenging/entities'
import type { SolutionsRepository } from '@stardust/core/challenging/interfaces'
import type { SolutionsListingParams } from '@stardust/core/challenging/types'
import type { Id, Slug } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import { AuthError } from '@stardust/core/global/errors'
import type { DrizzleTransaction } from '../../DrizzleClient'
import { DrizzleRepository } from '../../DrizzleRepository'
import { solutionModel } from '../../models/challenging/solution-model'
import { userModel } from '../../models/profile/user-model'
import { avatarModel } from '../../models/shop/avatar-model'
import { userUpvotedSolutionModel } from '../../models/profile/user-upvoted-solution-model'
import { solutionCommentModel } from '../../models/forum/solution-comment-model'
import { DrizzleSolutionMapper } from '../../mappers/challenging/DrizzleSolutionMapper'
import type { DrizzleInsertSolution } from '../../types/entities/challenging'

export class DrizzleSolutionsRepository
  extends DrizzleRepository
  implements SolutionsRepository
{
  private authorize(): void {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
  }

  private authorizeOwner(userId: string): void {
    this.authorize()
    if (this.access.kind === 'user' && this.access.accountId.value !== userId)
      throw new AuthError('Conta não autorizada')
  }

  private ownerCondition(): SQL | undefined {
    this.authorize()
    return this.access.kind === 'user'
      ? eq(solutionModel.userId, this.access.accountId.value)
      : undefined
  }

  private upvotesCount() {
    return sql<number>`(select count(*)::integer from ${userUpvotedSolutionModel} where ${userUpvotedSolutionModel.solutionId} = ${solutionModel.id})`
  }

  private commentsCount() {
    return sql<number>`(select count(*)::integer from ${solutionCommentModel} where ${solutionCommentModel.solutionId} = ${solutionModel.id})`
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

  private readColumns() {
    return {
      ...getTableColumns(solutionModel),
      ...this.authorColumns(),
      upvotesCount: this.upvotesCount(),
      commentsCount: this.commentsCount(),
    }
  }

  private query() {
    return this.database
      .select(this.readColumns())
      .from(solutionModel)
      .leftJoin(userModel, eq(userModel.id, solutionModel.userId))
      .leftJoin(avatarModel, eq(avatarModel.id, userModel.avatarId))
  }

  private async findOne(filter: SQL): Promise<Solution | null> {
    this.authorize()
    return this.findOneResult(
      async () => this.query().where(filter).limit(1),
      DrizzleSolutionMapper.toEntity,
    )
  }

  async findById(solutionId: Id): Promise<Solution | null> {
    return this.findOne(eq(solutionModel.id, solutionId.value))
  }

  async findBySlug(solutionSlug: Slug): Promise<Solution | null> {
    return this.findOne(eq(solutionModel.slug, solutionSlug.value))
  }

  async findMany(params: SolutionsListingParams): Promise<ManyItems<Solution>> {
    this.authorize()
    return this.executeQuery(() => this.listPage(params))
  }

  private listingFilter(params: SolutionsListingParams): SQL | undefined {
    return and(
      this.publicationFilter(params),
      params.title.isEmpty.isFalse
        ? ilike(solutionModel.title, `%${params.title.value}%`)
        : undefined,
    )
  }

  private publicationFilter(params: SolutionsListingParams) {
    return and(
      params.challengeId
        ? eq(solutionModel.challengeId, params.challengeId.value)
        : undefined,
      params.userId ? eq(solutionModel.userId, params.userId.value) : undefined,
    )
  }

  private listingOrder(params: SolutionsListingParams) {
    return {
      date: solutionModel.createdAt,
      upvotesCount: this.upvotesCount(),
      commentsCount: this.commentsCount(),
      viewsCount: solutionModel.viewsCount,
    }[params.sorter.value]
  }

  private pageRowsQuery(filter: SQL | undefined, params: SolutionsListingParams) {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
    return this.orderedSolutionsQuery(filter, params)
      .offset(range.offset)
      .limit(range.limit)
  }

  private orderedSolutionsQuery(filter: SQL | undefined, params: SolutionsListingParams) {
    return this.query()
      .where(filter)
      .orderBy(desc(this.listingOrder(params)))
  }

  private countQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(solutionModel)
      .where(filter)
  }

  private async listPage(params: SolutionsListingParams): Promise<ManyItems<Solution>> {
    const filter = this.listingFilter(params)
    const [rows, [total]] = await Promise.all([
      this.pageRowsQuery(filter, params),
      this.countQuery(filter),
    ])
    return this.mapPage(rows, total)
  }

  private mapPage(
    rows: Awaited<ReturnType<DrizzleSolutionsRepository['pageRowsQuery']>>,
    total:
      | Awaited<ReturnType<DrizzleSolutionsRepository['countQuery']>>[number]
      | undefined,
  ): ManyItems<Solution> {
    return { items: rows.map(DrizzleSolutionMapper.toEntity), count: total?.count ?? 0 }
  }

  async add(solution: Solution): Promise<void> {
    this.authorizeOwner(solution.author.id.value)
    await this.executeQuery(async () => {
      await this.database
        .insert(solutionModel)
        .values(DrizzleSolutionMapper.toPersistence(solution))
    })
  }

  private lockedSolutionQuery(transaction: DrizzleTransaction, solution: Solution) {
    return transaction
      .select()
      .from(solutionModel)
      .where(eq(solutionModel.id, solution.id.value))
      .for('update')
      .limit(1)
  }

  private assertViewProposal(
    solution: Solution,
    proposal: DrizzleInsertSolution,
    current: typeof solutionModel.$inferSelect,
  ): void {
    if (
      this.hasChangedPublication(proposal, current) ||
      solution.postedAt.getTime() !== current.createdAt.getTime()
    )
      throw new AuthError('Conta não autorizada')
  }

  private hasChangedPublication(
    proposal: DrizzleInsertSolution,
    current: typeof solutionModel.$inferSelect,
  ): boolean {
    const fields = [
      'title',
      'content',
      'slug',
      'challengeId',
      'userId',
    ] as const satisfies readonly (keyof DrizzleInsertSolution)[]
    return fields.some((field) => proposal[field] !== current[field])
  }

  private async registerView(solution: Solution): Promise<void> {
    const proposal = DrizzleSolutionMapper.toPersistence(solution)
    await this.database.transaction(async (transaction) => {
      const [current] = await this.lockedSolutionQuery(transaction, solution)
      if (!current) return
      this.assertViewProposal(solution, proposal, current)
      await this.incrementViews(transaction, solution)
    })
  }

  private incrementViews(transaction: DrizzleTransaction, solution: Solution) {
    return transaction
      .update(solutionModel)
      .set({ viewsCount: sql`${solutionModel.viewsCount} + 1` })
      .where(eq(solutionModel.id, solution.id.value))
  }

  async replace(solution: Solution): Promise<void> {
    this.authorize()
    await this.executeQuery(() => this.replaceSolution(solution))
  }

  private async replaceSolution(solution: Solution): Promise<void> {
    if (solution.isViewed.isTrue) {
      await this.registerView(solution)
      return
    }
    this.authorizeOwner(solution.author.id.value)
    await this.updatePublication(solution)
  }

  private updatePublication(solution: Solution) {
    const { title, content, slug } = solution.dto
    return this.database
      .update(solutionModel)
      .set({ title, content, slug })
      .where(and(eq(solutionModel.id, solution.id.value), this.ownerCondition()))
  }

  async remove(solutionId: Id): Promise<void> {
    const owner = this.ownerCondition()
    await this.executeQuery(async () => {
      await this.database
        .delete(solutionModel)
        .where(and(eq(solutionModel.id, solutionId.value), owner))
    })
  }

  async addSolutionUpvote(solutionId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId.value)
    await this.executeQuery(async () => {
      await this.database
        .insert(userUpvotedSolutionModel)
        .values({ solutionId: solutionId.value, userId: userId.value })
    })
  }

  async removeSolutionUpvote(solutionId: Id, userId: Id): Promise<void> {
    this.authorizeOwner(userId.value)
    await this.executeQuery(async () => this.removeUpvoteQuery(solutionId, userId))
  }

  private upvoteFilter(solutionId: Id, userId: Id) {
    return and(
      eq(userUpvotedSolutionModel.solutionId, solutionId.value),
      eq(userUpvotedSolutionModel.userId, userId.value),
    )
  }

  private removeUpvoteQuery(solutionId: Id, userId: Id) {
    return this.database
      .delete(userUpvotedSolutionModel)
      .where(this.upvoteFilter(solutionId, userId))
  }
}
