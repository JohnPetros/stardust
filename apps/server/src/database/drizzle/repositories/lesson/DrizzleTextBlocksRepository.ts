import { and, eq, sql, type SQL } from 'drizzle-orm'
import type { Id, Integer, TextBlock } from '@stardust/core/global/structures'
import type { TextBlockAudio } from '@stardust/core/lesson/structures'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { DrizzleDatabaseError } from '../../errors'
import { starModel } from '../../models/space/star-model'
import { DrizzleTextBlockMapper } from '../../mappers/lesson'

export class DrizzleTextBlocksRepository
  extends DrizzleRepository
  implements TextBlocksRepository
{
  private authorizeWrite(): void {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
  }

  async findAllByStar(starId: Id): Promise<TextBlock[]> {
    return this.executeQuery(async () => {
      const row = await this.requirePayload(starId)
      return (row.texts ?? []).map(DrizzleTextBlockMapper.toEntity)
    })
  }

  private payloadQuery(starId: Id) {
    return this.database
      .select({ texts: starModel.texts })
      .from(starModel)
      .where(eq(starModel.id, starId.value))
      .limit(1)
  }

  private async requirePayload(starId: Id) {
    const [row] = await this.payloadQuery(starId)
    if (!row) throw new DrizzleDatabaseError()
    return row
  }

  async updateMany(textBlocks: TextBlock[], starId: Id): Promise<void> {
    this.authorizeWrite()
    return this.executeQuery(async () => {
      await this.database
        .update(starModel)
        .set({ texts: textBlocks.map(DrizzleTextBlockMapper.toPersistence) })
        .where(eq(starModel.id, starId.value))
    })
  }

  private audioFilter(starId: Id, blockIndex: Integer) {
    return and(
      eq(starModel.id, starId.value),
      sql`jsonb_typeof(${starModel.texts}) = 'array'`,
      sql`${blockIndex.value} >= 0 AND ${blockIndex.value} < jsonb_array_length(${starModel.texts})`,
    )
  }

  private audioChangeQuery(starId: Id, blockIndex: Integer, texts: SQL) {
    return this.database
      .update(starModel)
      .set({ texts })
      .where(this.audioFilter(starId, blockIndex))
      .returning({ id: starModel.id })
  }

  private async applyAudioChange(
    starId: Id,
    blockIndex: Integer,
    texts: SQL,
  ): Promise<void> {
    const rows = await this.audioChangeQuery(starId, blockIndex, texts)
    if (!rows.length) throw new DrizzleDatabaseError()
  }

  async updateAudio(
    starId: Id,
    blockIndex: Integer,
    audio: TextBlockAudio,
  ): Promise<void> {
    this.authorizeWrite()
    return this.executeQuery(() =>
      this.applyAudioChange(
        starId,
        blockIndex,
        sql`jsonb_set(${starModel.texts}, ARRAY[${blockIndex.value}::text, 'audio'], ${JSON.stringify(audio.dto)}::jsonb, true)`,
      ),
    )
  }

  async clearAudio(starId: Id, blockIndex: Integer): Promise<void> {
    this.authorizeWrite()
    return this.executeQuery(() =>
      this.applyAudioChange(
        starId,
        blockIndex,
        sql`jsonb_set(${starModel.texts}, ARRAY[${blockIndex.value}::text], (${starModel.texts} -> ${blockIndex.value}::integer) - 'audio', false)`,
      ),
    )
  }
}
