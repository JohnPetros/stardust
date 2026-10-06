import { asc, desc, eq, type SQL } from 'drizzle-orm'
import type { Guide } from '@stardust/core/manual/entities'
import type { GuideCategory } from '@stardust/core/manual/structures'
import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Id } from '@stardust/core/global/structures'
import { AuthError } from '@stardust/core/global/errors'
import type { DrizzleTransaction } from '../../DrizzleClient'
import { DrizzleRepository } from '../../DrizzleRepository'
import { DrizzleGuideMapper } from '../../mappers/manual'
import { guideModel } from '../../models/manual/guide-model'

export class DrizzleGuidesRepository
  extends DrizzleRepository
  implements GuidesRepository
{
  private authorizeWrite(): void {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
  }

  async findById(id: Id): Promise<Guide | null> {
    return this.findOne(eq(guideModel.id, id.value))
  }

  private findOne(filter: SQL, descending = false): Promise<Guide | null> {
    return this.executeQuery(async () => {
      const query = this.database.select().from(guideModel).where(filter).$dynamic()
      if (descending) query.orderBy(desc(guideModel.position))
      const [row] = await query.limit(1)
      return row ? DrizzleGuideMapper.toEntity(row) : null
    })
  }

  async findAll(): Promise<Guide[]> {
    return this.executeQuery(async () =>
      (
        await this.database.select().from(guideModel).orderBy(asc(guideModel.position))
      ).map(DrizzleGuideMapper.toEntity),
    )
  }

  async findAllByCategory(category: GuideCategory): Promise<Guide[]> {
    return this.executeQuery(async () =>
      (
        await this.database
          .select()
          .from(guideModel)
          .where(eq(guideModel.category, category.value))
          .orderBy(asc(guideModel.position))
      ).map(DrizzleGuideMapper.toEntity),
    )
  }

  async findLastByPositionAndCategory(category: GuideCategory): Promise<Guide | null> {
    return this.findOne(eq(guideModel.category, category.value), true)
  }

  async add(guide: Guide): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .insert(guideModel)
        .values(DrizzleGuideMapper.toPersistence(guide))
    })
  }

  async replace(guide: Guide): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .update(guideModel)
        .set(DrizzleGuideMapper.toPersistence(guide))
        .where(eq(guideModel.id, guide.id.value))
    })
  }

  async replaceMany(guides: Guide[]): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database.transaction(async (transaction) => {
        await this.persistGuides(transaction, guides)
      })
    })
  }

  private async persistGuides(
    transaction: DrizzleTransaction,
    guides: Guide[],
  ): Promise<void> {
    for (const guide of guides) await this.persistGuide(transaction, guide)
  }

  private async persistGuide(
    transaction: DrizzleTransaction,
    guide: Guide,
  ): Promise<void> {
    const row = DrizzleGuideMapper.toPersistence(guide)
    await transaction
      .insert(guideModel)
      .values(row)
      .onConflictDoUpdate({ target: guideModel.id, set: row })
  }

  async remove(guide: Guide): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database.delete(guideModel).where(eq(guideModel.id, guide.id.value))
    })
  }
}
