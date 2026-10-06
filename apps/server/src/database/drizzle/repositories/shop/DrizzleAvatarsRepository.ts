import { asc, desc, eq, ilike, sql, type SQL } from 'drizzle-orm'
import type { Avatar } from '@stardust/core/shop/entities'
import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import type { Id, Integer } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import type { ShopItemsListingParams } from '@stardust/core/shop/types'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { avatarModel } from '../../models/shop/avatar-model'
import { DrizzleAvatarMapper } from '../../mappers/shop/DrizzleAvatarMapper'

export class DrizzleAvatarsRepository
  extends DrizzleRepository
  implements AvatarsRepository
{
  private authorizeWrite(): void {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
  }

  async findById(id: Id): Promise<Avatar | null> {
    return this.findOneResult(
      async () =>
        this.database
          .select()
          .from(avatarModel)
          .where(eq(avatarModel.id, id.value))
          .limit(1),
      DrizzleAvatarMapper.toEntity,
    )
  }

  async findSelectedByDefault(): Promise<Avatar | null> {
    return this.findOneResult(
      async () =>
        this.database
          .select()
          .from(avatarModel)
          .where(eq(avatarModel.isSelectedByDefault, true))
          .limit(1),
      DrizzleAvatarMapper.toEntity,
    )
  }

  async findAllByPrice(price: Integer): Promise<Avatar[]> {
    return this.findManyResults(
      async () =>
        this.database
          .select()
          .from(avatarModel)
          .where(eq(avatarModel.price, price.value)),
      DrizzleAvatarMapper.toEntity,
    )
  }

  async findMany(params: ShopItemsListingParams): Promise<ManyItems<Avatar>> {
    return this.executeQuery(() => this.listPage(params))
  }

  private searchFilter(search: ShopItemsListingParams['search']): SQL | undefined {
    return search && search.value.length > 1
      ? ilike(avatarModel.name, `%${search.value}%`)
      : undefined
  }

  private priceOrdering(priceOrder: ShopItemsListingParams['priceOrder']): SQL[] {
    if (priceOrder.isAny.isTrue) return []
    return [
      priceOrder.isAscending.value ? asc(avatarModel.price) : desc(avatarModel.price),
    ]
  }

  private listingQuery(
    filter: SQL | undefined,
    priceOrder: ShopItemsListingParams['priceOrder'],
  ) {
    return this.database
      .select()
      .from(avatarModel)
      .where(filter)
      .orderBy(...this.priceOrdering(priceOrder))
  }

  private countQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(avatarModel)
      .where(filter)
  }

  private pageRowsQuery(filter: SQL | undefined, params: ShopItemsListingParams) {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
    return this.listingQuery(filter, params.priceOrder)
      .offset(range.offset)
      .limit(range.limit)
  }

  private async listPage(params: ShopItemsListingParams): Promise<ManyItems<Avatar>> {
    const filter = this.searchFilter(params.search)
    const [rows, [total]] = await Promise.all([
      this.pageRowsQuery(filter, params),
      this.countQuery(filter),
    ])
    return this.mapPage(rows, total)
  }

  private mapPage(
    rows: (typeof avatarModel.$inferSelect)[],
    total:
      | Awaited<ReturnType<DrizzleAvatarsRepository['countQuery']>>[number]
      | undefined,
  ): ManyItems<Avatar> {
    return {
      items: rows.map(DrizzleAvatarMapper.toEntity),
      count: total?.count ?? rows.length,
    }
  }

  async add(entity: Avatar): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .insert(avatarModel)
        .values(DrizzleAvatarMapper.toPersistence(entity))
    })
  }

  async replace(entity: Avatar): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .update(avatarModel)
        .set(DrizzleAvatarMapper.toPersistence(entity))
        .where(eq(avatarModel.id, entity.id.value))
    })
  }

  async remove(id: Id): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database.delete(avatarModel).where(eq(avatarModel.id, id.value))
    })
  }
}
