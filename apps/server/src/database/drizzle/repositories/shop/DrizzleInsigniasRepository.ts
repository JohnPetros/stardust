import { and, eq, isNull, ne, or } from 'drizzle-orm'
import type { Insignia } from '@stardust/core/shop/entities'
import type { InsigniasRepository } from '@stardust/core/shop/interfaces'
import type { Id, InsigniaRole } from '@stardust/core/global/structures'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { insigniaModel } from '../../models/shop/insignia-model'
import { DrizzleInsigniaMapper } from '../../mappers/shop/DrizzleInsigniaMapper'

export class DrizzleInsigniasRepository
  extends DrizzleRepository
  implements InsigniasRepository
{
  private authorizeWrite(): void {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
  }

  async findById(id: Id): Promise<Insignia | null> {
    return this.findOneResult(
      async () =>
        this.database
          .select()
          .from(insigniaModel)
          .where(eq(insigniaModel.id, id.value))
          .limit(1),
      DrizzleInsigniaMapper.toEntity,
    )
  }

  async findByRole(role: InsigniaRole): Promise<Insignia | null> {
    return this.findOneResult(
      async () =>
        this.database
          .select()
          .from(insigniaModel)
          .where(eq(insigniaModel.role, role.value))
          .limit(1),
      DrizzleInsigniaMapper.toEntity,
    )
  }

  async findAll(): Promise<Insignia[]> {
    return this.findManyResults(
      async () => this.database.select().from(insigniaModel),
      DrizzleInsigniaMapper.toEntity,
    )
  }

  async findAllPurchasable(): Promise<Insignia[]> {
    return this.findManyResults(
      async () =>
        this.database
          .select()
          .from(insigniaModel)
          .where(
            or(
              eq(insigniaModel.isPurchasable, true),
              and(isNull(insigniaModel.isPurchasable), ne(insigniaModel.role, 'god')),
            ),
          ),
      DrizzleInsigniaMapper.toEntity,
    )
  }

  async add(entity: Insignia): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .insert(insigniaModel)
        .values(DrizzleInsigniaMapper.toPersistence(entity))
    })
  }

  async replace(entity: Insignia): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .update(insigniaModel)
        .set(DrizzleInsigniaMapper.toPersistence(entity))
        .where(eq(insigniaModel.id, entity.id.value))
    })
  }

  async remove(id: Id): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database.delete(insigniaModel).where(eq(insigniaModel.id, id.value))
    })
  }
}
