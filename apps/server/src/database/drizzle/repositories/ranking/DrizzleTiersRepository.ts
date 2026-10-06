import { asc, eq } from 'drizzle-orm'
import type { Tier } from '@stardust/core/ranking/entities'
import type { TiersRepository } from '@stardust/core/ranking/interfaces'
import type { Id, OrdinalNumber } from '@stardust/core/global/structures'
import { DrizzleRepository } from '../../DrizzleRepository'
import { tierModel } from '../../models/ranking/tier-model'
import { DrizzleTierMapper } from '../../mappers/ranking/DrizzleTierMapper'

export class DrizzleTiersRepository extends DrizzleRepository implements TiersRepository {
  async findAll(): Promise<Tier[]> {
    return this.findManyResults(
      async () => this.database.select().from(tierModel).orderBy(asc(tierModel.position)),
      DrizzleTierMapper.toEntity,
    )
  }

  async findById(id: Id): Promise<Tier | null> {
    return this.findOneResult(
      async () =>
        this.database.select().from(tierModel).where(eq(tierModel.id, id.value)).limit(1),
      DrizzleTierMapper.toEntity,
    )
  }

  async findByPosition(position: OrdinalNumber): Promise<Tier | null> {
    return this.findOneResult(
      async () =>
        this.database
          .select()
          .from(tierModel)
          .where(eq(tierModel.position, position.number.value))
          .limit(1),
      DrizzleTierMapper.toEntity,
    )
  }
}
