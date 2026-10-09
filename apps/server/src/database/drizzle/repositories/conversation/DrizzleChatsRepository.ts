import { and, desc, eq, ilike, sql, type SQL } from 'drizzle-orm'
import type { Chat } from '@stardust/core/conversation/entities'
import type { ChatsRepository } from '@stardust/core/conversation/interfaces'
import type { ChatsListingParams } from '@stardust/core/conversation/types'
import type { Id } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { DrizzleChatMapper } from '../../mappers/conversation'
import { chatModel } from '../../models/conversation/chat-model'

export class DrizzleChatsRepository extends DrizzleRepository implements ChatsRepository {
  private ownerCondition(): SQL | undefined {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
    return this.access.kind === 'user'
      ? eq(chatModel.userId, this.access.accountId.value)
      : undefined
  }

  private authorizeOwner(userId: Id): void {
    this.ownerCondition()
    if (this.access.kind === 'user' && this.access.accountId.value !== userId.value)
      throw new AuthError('Conta não autorizada')
  }

  async findById(chatId: Id): Promise<Chat | null> {
    const owner = this.ownerCondition()
    return this.findOneResult(
      async () =>
        this.database
          .select()
          .from(chatModel)
          .where(and(eq(chatModel.id, chatId.value), owner))
          .limit(1),
      DrizzleChatMapper.toEntity,
    )
  }

  async findManyByUser(params: ChatsListingParams): Promise<ManyItems<Chat>> {
    this.authorizeOwner(params.userId)
    return this.executeQuery(() => this.listPage(params))
  }

  private listingFilter(params: ChatsListingParams) {
    return and(
      eq(chatModel.userId, params.userId.value),
      this.searchCondition(params.search),
    )
  }

  private searchCondition(search: ChatsListingParams['search']): SQL | undefined {
    return search && search.value.length > 1
      ? ilike(chatModel.name, `%${search.value}%`)
      : undefined
  }

  private pageRowsQuery(filter: SQL | undefined, params: ChatsListingParams) {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
    return this.orderedRowsQuery(filter).offset(range.offset).limit(range.limit)
  }

  private orderedRowsQuery(filter: SQL | undefined) {
    return this.database
      .select()
      .from(chatModel)
      .where(filter)
      .orderBy(desc(chatModel.createdAt))
  }

  private countQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(chatModel)
      .where(filter)
  }

  private async listPage(params: ChatsListingParams): Promise<ManyItems<Chat>> {
    const filter = this.listingFilter(params)
    const [rows, [total]] = await Promise.all([
      this.pageRowsQuery(filter, params),
      this.countQuery(filter),
    ])
    return this.mapPage(rows, total)
  }

  private mapPage(
    rows: (typeof chatModel.$inferSelect)[],
    total: Awaited<ReturnType<DrizzleChatsRepository['countQuery']>>[number] | undefined,
  ): ManyItems<Chat> {
    return {
      items: rows.map(DrizzleChatMapper.toEntity),
      count: total?.count ?? rows.length,
    }
  }

  async findLastCreatedByUser(userId: Id): Promise<Chat | null> {
    this.authorizeOwner(userId)
    return this.findOneResult(
      async () => this.lastCreatedQuery(userId),
      DrizzleChatMapper.toEntity,
    )
  }

  private lastCreatedQuery(userId: Id) {
    return this.orderedRowsQuery(eq(chatModel.userId, userId.value)).limit(1)
  }

  async add(chat: Chat, userId: Id): Promise<void> {
    this.authorizeOwner(userId)
    await this.executeQuery(async () => {
      await this.database
        .insert(chatModel)
        .values(new DrizzleChatMapper(userId).toPersistence(chat))
    })
  }

  async replace(chat: Chat): Promise<void> {
    const owner = this.ownerCondition()
    await this.executeQuery(async () => {
      await this.database
        .update(chatModel)
        .set({ name: chat.name.value })
        .where(and(eq(chatModel.id, chat.id.value), owner))
    })
  }

  async remove(chatId: Id): Promise<void> {
    const owner = this.ownerCondition()
    await this.executeQuery(async () => {
      await this.database
        .delete(chatModel)
        .where(and(eq(chatModel.id, chatId.value), owner))
    })
  }
}
