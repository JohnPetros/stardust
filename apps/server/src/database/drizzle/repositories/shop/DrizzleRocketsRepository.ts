import { asc, desc, eq, ilike, sql, type SQL } from 'drizzle-orm'
import type { Rocket } from '@stardust/core/shop/entities'
import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import type { Id, Integer } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import type { ShopItemsListingParams } from '@stardust/core/shop/types'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { rocketModel } from '../../models/shop/rocket-model'
import { DrizzleRocketMapper } from '../../mappers/shop/DrizzleRocketMapper'

export class DrizzleRocketsRepository
  extends DrizzleRepository
  implements RocketsRepository
{
  private authorizeWrite(): void {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
  }

  async findById(id: Id): Promise<Rocket | null> {
    return this.findOneResult(
      async () =>
        this.database
          .select()
          .from(rocketModel)
          .where(eq(rocketModel.id, id.value))
          .limit(1),
      DrizzleRocketMapper.toEntity,
    )
  }

  async findSelectedByDefault(): Promise<Rocket | null> {
    return this.findOneResult(
      async () =>
        this.database
          .select()
          .from(rocketModel)
          .where(eq(rocketModel.isSelectedByDefault, true))
          .limit(1),
      DrizzleRocketMapper.toEntity,
    )
  }

  async findAllByPrice(price: Integer): Promise<Rocket[]> {
    return this.findManyResults(
      async () =>
        this.database
          .select()
          .from(rocketModel)
          .where(eq(rocketModel.price, price.value)),
      DrizzleRocketMapper.toEntity,
    )
  }

  async findMany(params: ShopItemsListingParams): Promise<ManyItems<Rocket>> {
    return this.executeQuery(() => this.listPage(params))
  }

  private searchFilter(search: ShopItemsListingParams['search']): SQL | undefined {
    return search && search.value.length > 1
      ? ilike(rocketModel.name, `%${search.value}%`)
      : undefined
  }

  private priceOrdering(priceOrder: ShopItemsListingParams['priceOrder']): SQL[] {
    if (priceOrder.isAny.isTrue) return []
    return [
      priceOrder.isAscending.value ? asc(rocketModel.price) : desc(rocketModel.price),
    ]
  }

  private listingQuery(
    filter: SQL | undefined,
    priceOrder: ShopItemsListingParams['priceOrder'],
  ) {
    return this.database
      .select()
      .from(rocketModel)
      .where(filter)
      .orderBy(...this.priceOrdering(priceOrder))
  }

  private countQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(rocketModel)
      .where(filter)
  }

  private pageRowsQuery(filter: SQL | undefined, params: ShopItemsListingParams) {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
    return this.listingQuery(filter, params.priceOrder)
      .offset(range.offset)
      .limit(range.limit)
  }

  private async listPage(params: ShopItemsListingParams): Promise<ManyItems<Rocket>> {
    const filter = this.searchFilter(params.search)
    const [rows, [total]] = await Promise.all([
      this.pageRowsQuery(filter, params),
      this.countQuery(filter),
    ])
    return this.mapPage(rows, total)
  }

  private mapPage(
    rows: (typeof rocketModel.$inferSelect)[],
    total:
      | Awaited<ReturnType<DrizzleRocketsRepository['countQuery']>>[number]
      | undefined,
  ): ManyItems<Rocket> {
    return {
      items: rows.map(DrizzleRocketMapper.toEntity),
      count: total?.count ?? rows.length,
    }
  }

  async add(entity: Rocket): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .insert(rocketModel)
        .values(DrizzleRocketMapper.toPersistence(entity))
    })
  }

  async replace(entity: Rocket): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .update(rocketModel)
        .set(DrizzleRocketMapper.toPersistence(entity))
        .where(eq(rocketModel.id, entity.id.value))
    })
  }

  async remove(id: Id): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database.delete(rocketModel).where(eq(rocketModel.id, id.value))
    })
  }
}
