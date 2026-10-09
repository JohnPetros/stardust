import { asc, eq, getTableColumns, sql, type SQL } from 'drizzle-orm'
import type { Star } from '@stardust/core/space/entities'
import type { StarsRepository } from '@stardust/core/space/interfaces'
import { Id, type OrdinalNumber, type Slug } from '@stardust/core/global/structures'
import { AuthError } from '@stardust/core/global/errors'
import type { DrizzleTransaction } from '../../DrizzleClient'
import { DrizzleRepository } from '../../DrizzleRepository'
import { starModel } from '../../models/space/star-model'
import { DrizzleStarMapper } from '../../mappers/space/DrizzleStarMapper'

export class DrizzleStarsRepository extends DrizzleRepository implements StarsRepository {
  private authorizeWrite(): void {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
  }

  private projection() {
    return {
      ...getTableColumns(starModel),
      userCount: sql<number>`public.count_users_at_star(${starModel})::integer`,
      unlockCount: sql<number>`public.count_star_unlocks(${starModel})::integer`,
    }
  }

  async findAllOrdered(): Promise<Star[]> {
    return this.findManyResults(
      async () =>
        this.database
          .select(this.projection())
          .from(starModel)
          .orderBy(asc(starModel.id)),
      DrizzleStarMapper.toEntity,
    )
  }

  private async findOne(filter: SQL): Promise<Star | null> {
    return this.findOneResult(
      async () =>
        this.database.select(this.projection()).from(starModel).where(filter).limit(1),
      DrizzleStarMapper.toEntity,
    )
  }

  async findById(starId: Id): Promise<Star | null> {
    return this.findOne(eq(starModel.id, starId.value))
  }

  async findBySlug(starSlug: Slug): Promise<Star | null> {
    return this.findOne(eq(starModel.slug, starSlug.value))
  }

  async findByNumber(position: OrdinalNumber): Promise<Star | null> {
    return this.findOne(eq(starModel.number, position.value))
  }

  async add(star: Star, planetId: Id): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .insert(starModel)
        .values(new DrizzleStarMapper(planetId).toPersistence(star))
    })
  }

  async replace(star: Star): Promise<void> {
    await this.replaceMany([star])
  }

  async replaceMany(stars: Star[]): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database.transaction(async (transaction) => {
        for (const star of stars) await this.replaceStar(transaction, star)
      })
    })
  }

  private async replaceStar(transaction: DrizzleTransaction, star: Star): Promise<void> {
    const [current] = await this.lockedStarQuery(transaction, star)
    if (!current) return
    await this.updateStar(transaction, star, Id.create(current.planetId))
  }

  private lockedStarQuery(transaction: DrizzleTransaction, star: Star) {
    return transaction
      .select({ planetId: starModel.planetId })
      .from(starModel)
      .where(eq(starModel.id, star.id.value))
      .for('update')
      .limit(1)
  }

  private async updateStar(
    transaction: DrizzleTransaction,
    star: Star,
    planetId: Id,
  ): Promise<void> {
    await transaction
      .update(starModel)
      .set(new DrizzleStarMapper(planetId).toPersistence(star))
      .where(eq(starModel.id, star.id.value))
  }

  async remove(starId: Id): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database.delete(starModel).where(eq(starModel.id, starId.value))
    })
  }
}
