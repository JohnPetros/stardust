import { asc, desc, eq, getTableColumns, ilike, isNull, sql, type SQL } from 'drizzle-orm'
import type { ChallengeSource } from '@stardust/core/challenging/entities'
import type { ChallengeSourcesRepository } from '@stardust/core/challenging/interfaces'
import type { ChallengeSourcesListParams } from '@stardust/core/challenging/types'
import type { Id } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import { AuthError } from '@stardust/core/global/errors'
import type { DrizzleTransaction } from '../../DrizzleClient'
import { DrizzleRepository } from '../../DrizzleRepository'
import { challengeSourceModel } from '../../models/challenging/challenge-source-model'
import { challengeModel } from '../../models/challenging/challenge-model'
import { DrizzleChallengeSourceMapper } from '../../mappers/challenging/DrizzleChallengeSourceMapper'

export class DrizzleChallengeSourcesRepository
  extends DrizzleRepository
  implements ChallengeSourcesRepository
{
  private authorize(): void {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
  }

  private query() {
    return this.database
      .select(this.readColumns())
      .from(challengeSourceModel)
      .leftJoin(challengeModel, eq(challengeModel.id, challengeSourceModel.challengeId))
  }

  private readColumns() {
    return {
      ...getTableColumns(challengeSourceModel),
      challenge: {
        id: challengeModel.id,
        title: challengeModel.title,
        slug: challengeModel.slug,
      },
    }
  }

  private async findOne(filter: SQL): Promise<ChallengeSource | null> {
    this.authorize()
    return this.findOneResult(
      async () =>
        this.query().where(filter).orderBy(asc(challengeSourceModel.position)).limit(1),
      DrizzleChallengeSourceMapper.toEntity,
    )
  }

  async findById(challengeSourceId: Id): Promise<ChallengeSource | null> {
    return this.findOne(eq(challengeSourceModel.id, challengeSourceId.value))
  }

  async findByChallengeId(challengeId: Id): Promise<ChallengeSource | null> {
    return this.findOne(eq(challengeSourceModel.challengeId, challengeId.value))
  }

  async findNextNotUsed(): Promise<ChallengeSource | null> {
    return this.findOne(isNull(challengeSourceModel.challengeId))
  }

  async findAll(): Promise<ChallengeSource[]> {
    this.authorize()
    return this.findManyResults(
      async () => this.query().orderBy(asc(challengeSourceModel.position)),
      DrizzleChallengeSourceMapper.toEntity,
    )
  }

  async findMany(
    params: ChallengeSourcesListParams,
  ): Promise<ManyItems<ChallengeSource>> {
    this.authorize()
    return this.executeQuery(() => this.listPage(params))
  }

  private listingFilter(params: ChallengeSourcesListParams): SQL | undefined {
    return params.title.isEmpty.isTrue
      ? undefined
      : ilike(challengeModel.title, `%${params.title.value}%`)
  }

  private pageRowsQuery(filter: SQL | undefined, params: ChallengeSourcesListParams) {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
    return this.orderedSourcesQuery(filter, params)
      .offset(range.offset)
      .limit(range.limit)
  }

  private orderedSourcesQuery(
    filter: SQL | undefined,
    params: ChallengeSourcesListParams,
  ) {
    return this.query().where(filter).orderBy(this.positionOrdering(params))
  }

  private positionOrdering(params: ChallengeSourcesListParams) {
    return params.positionOrder.isAny.isTrue || params.positionOrder.isAscending.isTrue
      ? asc(challengeSourceModel.position)
      : desc(challengeSourceModel.position)
  }

  private countQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(challengeSourceModel)
      .leftJoin(challengeModel, eq(challengeModel.id, challengeSourceModel.challengeId))
      .where(filter)
  }

  private async listPage(
    params: ChallengeSourcesListParams,
  ): Promise<ManyItems<ChallengeSource>> {
    const filter = this.listingFilter(params)
    const [rows, [total]] = await Promise.all([
      this.pageRowsQuery(filter, params),
      this.countQuery(filter),
    ])
    return this.mapPage(rows, total)
  }

  private mapPage(
    rows: Awaited<ReturnType<DrizzleChallengeSourcesRepository['pageRowsQuery']>>,
    total:
      | Awaited<ReturnType<DrizzleChallengeSourcesRepository['countQuery']>>[number]
      | undefined,
  ): ManyItems<ChallengeSource> {
    return {
      items: rows.map(DrizzleChallengeSourceMapper.toEntity),
      count: total?.count ?? 0,
    }
  }

  async add(source: ChallengeSource): Promise<void> {
    this.authorize()
    await this.executeQuery(async () => {
      await this.database
        .insert(challengeSourceModel)
        .values(DrizzleChallengeSourceMapper.toPersistence(source))
    })
  }

  async replace(source: ChallengeSource): Promise<void> {
    this.authorize()
    await this.executeQuery(async () => {
      await this.database
        .update(challengeSourceModel)
        .set(DrizzleChallengeSourceMapper.toPersistence(source))
        .where(eq(challengeSourceModel.id, source.id.value))
    })
  }

  async replaceMany(sources: ChallengeSource[]): Promise<void> {
    this.authorize()
    await this.executeQuery(async () => {
      await this.database.transaction(async (transaction) => {
        const maximum = await this.maximumPosition(transaction, sources)
        await this.moveToTemporaryPositions(transaction, sources, maximum)
        await this.persistPositions(transaction, sources)
      })
    })
  }

  private async maximumPosition(
    transaction: DrizzleTransaction,
    sources: ChallengeSource[],
  ): Promise<number> {
    const existing = await this.lockPositions(transaction)
    return Math.max(
      0,
      ...existing.map((row) => row.position),
      ...sources.map((source) => source.position.value),
    )
  }

  private lockPositions(transaction: DrizzleTransaction) {
    return transaction
      .select({ position: challengeSourceModel.position })
      .from(challengeSourceModel)
      .for('update')
  }

  private async moveToTemporaryPositions(
    transaction: DrizzleTransaction,
    sources: ChallengeSource[],
    maximum: number,
  ): Promise<void> {
    for (const [index, source] of sources.entries())
      await transaction
        .update(challengeSourceModel)
        .set({ position: maximum + index + 1 })
        .where(eq(challengeSourceModel.id, source.id.value))
  }

  private async persistPositions(
    transaction: DrizzleTransaction,
    sources: ChallengeSource[],
  ): Promise<void> {
    for (const source of sources)
      await transaction
        .update(challengeSourceModel)
        .set(DrizzleChallengeSourceMapper.toPersistence(source))
        .where(eq(challengeSourceModel.id, source.id.value))
  }

  async remove(challengeSourceId: Id): Promise<void> {
    this.authorize()
    await this.executeQuery(async () => {
      await this.database
        .delete(challengeSourceModel)
        .where(eq(challengeSourceModel.id, challengeSourceId.value))
    })
  }
}
