import { and, asc, eq, type SQL } from 'drizzle-orm'
import type { ChatMessagesRepository } from '@stardust/core/conversation/interfaces'
import type { ChatMessage } from '@stardust/core/conversation/structures'
import type { Id } from '@stardust/core/global/structures'
import { AuthError } from '@stardust/core/global/errors'
import type { DrizzleTransaction } from '../../DrizzleClient'
import { DrizzleRepository } from '../../DrizzleRepository'
import { DrizzleChatMessageMapper } from '../../mappers/conversation'
import { chatModel } from '../../models/conversation/chat-model'
import { chatMessageModel } from '../../models/conversation/chat-message-model'

export class DrizzleChatMessagesRepository
  extends DrizzleRepository
  implements ChatMessagesRepository
{
  private ownerCondition(): SQL | undefined {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
    return this.access.kind === 'user'
      ? eq(chatModel.userId, this.access.accountId.value)
      : undefined
  }

  async findAllByChat(chatId: Id): Promise<ChatMessage[]> {
    const owner = this.ownerCondition()
    return this.findManyResults(
      async () =>
        this.database
          .select({ message: chatMessageModel })
          .from(chatMessageModel)
          .innerJoin(chatModel, eq(chatModel.id, chatMessageModel.chatId))
          .where(and(eq(chatModel.id, chatId.value), owner))
          .orderBy(asc(chatMessageModel.createdAt)),
      ({ message }) => DrizzleChatMessageMapper.toEntity(message),
    )
  }

  async add(chatId: Id, chatMessage: ChatMessage): Promise<void> {
    const owner = this.ownerCondition()
    return this.executeQuery(async () => {
      await this.database.transaction(async (transaction) => {
        await this.lockChat(transaction, chatId, owner)
        await transaction
          .insert(chatMessageModel)
          .values(new DrizzleChatMessageMapper(chatId).toPersistence(chatMessage))
      })
    })
  }

  private lockedChatQuery(
    transaction: DrizzleTransaction,
    chatId: Id,
    owner: SQL | undefined,
  ) {
    return transaction
      .select({ id: chatModel.id })
      .from(chatModel)
      .where(and(eq(chatModel.id, chatId.value), owner))
      .limit(1)
      .for('update')
  }

  private async lockChat(
    transaction: DrizzleTransaction,
    chatId: Id,
    owner: SQL | undefined,
  ): Promise<void> {
    const [chat] = await this.lockedChatQuery(transaction, chatId, owner)
    if (!chat) throw new AuthError('Conta não autorizada')
  }
}
