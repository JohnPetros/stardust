import type { DrizzleTransaction } from '../../DrizzleClient'
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNull,
  sql,
  type SQL,
} from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsRepository } from '@stardust/core/forum/interfaces'
import type { CommentsListParams } from '@stardust/core/forum/types'
import type { Id } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { commentModel } from '../../models/forum/comment-model'
import { challengeCommentModel } from '../../models/forum/challenge-comment-model'
import { solutionCommentModel } from '../../models/forum/solution-comment-model'
import { userModel } from '../../models/profile/user-model'
import { avatarModel } from '../../models/shop/avatar-model'
import { userUpvotedCommentModel } from '../../models/profile/user-upvoted-comment-model'
import { DrizzleCommentMapper } from '../../mappers/forum/DrizzleCommentMapper'

export class DrizzleCommentsRepository
  extends DrizzleRepository
  implements CommentsRepository
{
  private authorize(): void {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
  }

  private authorizeOwner(userId: Id): void {
    this.authorize()
    if (this.access.kind === 'user' && this.access.accountId.value !== userId.value)
      throw new AuthError('Conta não autorizada')
  }

  private upvotesCount() {
    return sql<number>`(select count(*)::integer from ${userUpvotedCommentModel} where ${userUpvotedCommentModel.commentId} = ${commentModel.id})`
  }

  private query() {
    return this.database
      .select(this.readColumns())
      .from(commentModel)
      .leftJoin(userModel, eq(userModel.id, commentModel.userId))
      .leftJoin(avatarModel, eq(avatarModel.id, userModel.avatarId))
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

  private repliesCount() {
    const reply = alias(commentModel, 'comment_replies')
    return sql<number>`(select count(*)::integer from ${commentModel} as ${sql.identifier('comment_replies')} where ${reply.parentCommentId} = ${commentModel.id})`
  }

  private readColumns() {
    return {
      ...getTableColumns(commentModel),
      ...this.authorColumns(),
      upvotesCount: this.upvotesCount(),
      repliesCount: this.repliesCount(),
    }
  }

  async findById(commentId: Id): Promise<Comment | null> {
    return this.findOneResult(
      async () => this.query().where(eq(commentModel.id, commentId.value)).limit(1),
      DrizzleCommentMapper.toEntity,
    )
  }

  private async list(
    filter: SQL | undefined,
    params: CommentsListParams,
  ): Promise<ManyItems<Comment>> {
    return this.executeQuery(() => this.listPage(filter, params))
  }

  private listingOrder(params: CommentsListParams) {
    const column = params.sorter.isByUpvotes.isTrue
      ? this.upvotesCount()
      : commentModel.createdAt
    return params.order.isAscending.isTrue ? asc(column) : desc(column)
  }

  private orderedRootsQuery(filter: SQL | undefined, params: CommentsListParams) {
    return this.query()
      .where(and(filter, isNull(commentModel.parentCommentId)))
      .orderBy(this.listingOrder(params))
  }

  private pageRowsQuery(filter: SQL | undefined, params: CommentsListParams) {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
    return this.orderedRootsQuery(filter, params).offset(range.offset).limit(range.limit)
  }

  private countQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(commentModel)
      .where(and(filter, isNull(commentModel.parentCommentId)))
  }

  private async listPage(
    filter: SQL | undefined,
    params: CommentsListParams,
  ): Promise<ManyItems<Comment>> {
    const [rows, [total]] = await Promise.all([
      this.pageRowsQuery(filter, params),
      this.countQuery(filter),
    ])
    return this.mapPage(rows, total)
  }

  private mapPage(
    rows: Awaited<ReturnType<DrizzleCommentsRepository['pageRowsQuery']>>,
    total:
      | Awaited<ReturnType<DrizzleCommentsRepository['countQuery']>>[number]
      | undefined,
  ): ManyItems<Comment> {
    return { items: rows.map(DrizzleCommentMapper.toEntity), count: total?.count ?? 0 }
  }

  private linkedCommentsFilter(
    table: typeof challengeCommentModel | typeof solutionCommentModel,
    filter: SQL,
  ) {
    return inArray(
      commentModel.id,
      this.database.select({ commentId: table.commentId }).from(table).where(filter),
    )
  }

  async findManyByChallenge(
    challengeId: Id,
    params: CommentsListParams,
  ): Promise<ManyItems<Comment>> {
    return this.list(
      this.linkedCommentsFilter(
        challengeCommentModel,
        eq(challengeCommentModel.challengeId, challengeId.value),
      ),
      params,
    )
  }

  async findManyBySolution(
    solutionId: Id,
    params: CommentsListParams,
  ): Promise<ManyItems<Comment>> {
    return this.list(
      this.linkedCommentsFilter(
        solutionCommentModel,
        eq(solutionCommentModel.solutionId, solutionId.value),
      ),
      params,
    )
  }

  async findAllRepliesByComment(commentId: Id): Promise<Comment[]> {
    return this.findManyResults(
      async () =>
        this.query()
          .where(eq(commentModel.parentCommentId, commentId.value))
          .orderBy(desc(commentModel.createdAt)),
      DrizzleCommentMapper.toEntity,
    )
  }

  private insertRootComment(transaction: DrizzleTransaction, comment: Comment) {
    return transaction.insert(commentModel).values({
      ...DrizzleCommentMapper.toPersistence(comment),
      parentCommentId: null,
    })
  }

  async addByChallenge(comment: Comment, challengeId: Id): Promise<void> {
    this.authorizeOwner(comment.author.id)
    await this.executeQuery(async () => {
      await this.database.transaction(async (transaction) => {
        await this.insertRootComment(transaction, comment)
        await transaction
          .insert(challengeCommentModel)
          .values({ commentId: comment.id.value, challengeId: challengeId.value })
      })
    })
  }

  async addBySolution(comment: Comment, solutionId: Id): Promise<void> {
    this.authorizeOwner(comment.author.id)
    await this.executeQuery(async () => {
      await this.database.transaction(async (transaction) => {
        await this.insertRootComment(transaction, comment)
        await transaction
          .insert(solutionCommentModel)
          .values({ commentId: comment.id.value, solutionId: solutionId.value })
      })
    })
  }

  async addReply(reply: Comment, commentId: Id): Promise<void> {
    this.authorizeOwner(reply.author.id)
    await this.executeQuery(async () => {
      await this.database.insert(commentModel).values({
        ...DrizzleCommentMapper.toPersistence(reply),
        parentCommentId: commentId.value,
      })
    })
  }

  private ownerCondition(): SQL | undefined {
    this.authorize()
    return this.access.kind === 'user'
      ? eq(commentModel.userId, this.access.accountId.value)
      : undefined
  }

  async replace(comment: Comment): Promise<void> {
    this.authorizeOwner(comment.author.id)
    const owner = this.ownerCondition()
    await this.executeQuery(async () => {
      await this.database
        .update(commentModel)
        .set({ content: comment.content.value })
        .where(and(eq(commentModel.id, comment.id.value), owner))
    })
  }

  async remove(commentId: Id): Promise<void> {
    const owner = this.ownerCondition()
    await this.executeQuery(async () => {
      await this.database
        .delete(commentModel)
        .where(and(eq(commentModel.id, commentId.value), owner))
    })
  }
}
