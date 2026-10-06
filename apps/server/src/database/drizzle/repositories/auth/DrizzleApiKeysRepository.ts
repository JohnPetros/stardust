import { and, desc, eq, isNull, type SQL } from 'drizzle-orm'
import type { ApiKey } from '@stardust/core/auth/entities'
import type { ApiKeysRepository } from '@stardust/core/auth/interfaces'
import type { Id, Text } from '@stardust/core/global/structures'
import { AuthError } from '@stardust/core/global/errors'

import { DrizzleRepository } from '../../DrizzleRepository'
import { apiKeyModel } from '../../models/auth/api-key-model'
import { DrizzleApiKeyMapper } from '../../mappers/auth'

export class DrizzleApiKeysRepository
  extends DrizzleRepository
  implements ApiKeysRepository
{
  private ownerCondition(): SQL | undefined {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
    return this.access.kind === 'user'
      ? eq(apiKeyModel.userId, this.access.accountId.value)
      : undefined
  }

  private authorizeOwner(userId: Id): void {
    this.ownerCondition()
    if (this.access.kind === 'user' && this.access.accountId.value !== userId.value) {
      throw new AuthError('Conta não autorizada')
    }
  }

  async findById(apiKeyId: Id): Promise<ApiKey | null> {
    const owner = this.ownerCondition()
    return this.findOne(and(eq(apiKeyModel.id, apiKeyId.value), owner))
  }

  async findByHash(keyHash: Text): Promise<ApiKey | null> {
    const owner = this.access.kind === 'public' ? undefined : this.ownerCondition()
    return this.findOne(and(eq(apiKeyModel.keyHash, keyHash.value), owner))
  }

  private findOne(filter: SQL | undefined): Promise<ApiKey | null> {
    return this.findOneResult(
      async () => this.database.select().from(apiKeyModel).where(filter).limit(1),
      DrizzleApiKeyMapper.toEntity,
    )
  }

  async findManyByUserId(userId: Id): Promise<ApiKey[]> {
    this.authorizeOwner(userId)
    return this.findManyResults(
      async () =>
        this.database
          .select()
          .from(apiKeyModel)
          .where(and(eq(apiKeyModel.userId, userId.value), isNull(apiKeyModel.revokedAt)))
          .orderBy(desc(apiKeyModel.createdAt)),
      DrizzleApiKeyMapper.toEntity,
    )
  }

  async add(apiKey: ApiKey): Promise<void> {
    this.authorizeOwner(apiKey.userId)
    await this.executeQuery(async () => {
      await this.database
        .insert(apiKeyModel)
        .values(DrizzleApiKeyMapper.toPersistence(apiKey))
    })
  }

  async replace(apiKey: ApiKey): Promise<void> {
    this.authorizeOwner(apiKey.userId)
    const owner = this.ownerCondition()
    await this.executeQuery(async () => {
      await this.database
        .update(apiKeyModel)
        .set({ name: apiKey.name.value })
        .where(and(eq(apiKeyModel.id, apiKey.id.value), owner))
    })
  }

  async revoke(apiKeyId: Id, revokedAt: Date): Promise<void> {
    const owner = this.ownerCondition()
    await this.executeQuery(async () => {
      await this.database
        .update(apiKeyModel)
        .set({ revokedAt })
        .where(and(eq(apiKeyModel.id, apiKeyId.value), owner))
    })
  }
}
