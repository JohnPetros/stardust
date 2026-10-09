import { asc, desc, eq, getTableColumns, inArray, sql, type SQL } from 'drizzle-orm'
import type { Planet } from '@stardust/core/space/entities'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import type { Id, OrdinalNumber } from '@stardust/core/global/structures'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { planetModel } from '../../models/space/planet-model'
import { starModel } from '../../models/space/star-model'
import { DrizzlePlanetMapper } from '../../mappers/space/DrizzlePlanetMapper'

export class DrizzlePlanetsRepository
  extends DrizzleRepository
  implements PlanetsRepository
{
  private authorizeWrite(): void {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
  }

  private planetProjection() {
    return {
      ...getTableColumns(planetModel),
      completionCount: sql<number>`public.count_planet_completions(${planetModel})::integer`,
      userCount: sql<number>`public.count_users_at_planet(${planetModel})::integer`,
    }
  }

  private orderedPlanetsQuery(filter: SQL | undefined, last: boolean) {
    return this.database
      .select(this.planetProjection())
      .from(planetModel)
      .where(filter)
      .orderBy(last ? desc(planetModel.position) : asc(planetModel.position))
  }

  private planetsQuery(filter: SQL | undefined, last: boolean) {
    const query = this.orderedPlanetsQuery(filter, last)
    return last ? query.limit(1) : query
  }

  private starProjection() {
    return {
      ...getTableColumns(starModel),
      userCount: sql<number>`public.count_users_at_star(${starModel})::integer`,
      unlockCount: sql<number>`public.count_star_unlocks(${starModel})::integer`,
    }
  }

  private starsQuery(planetIds: string[]) {
    return this.database
      .select(this.starProjection())
      .from(starModel)
      .where(inArray(starModel.planetId, planetIds))
      .orderBy(asc(starModel.number))
  }

  private mapPlanet(
    row: Awaited<ReturnType<DrizzlePlanetsRepository['planetsQuery']>>[number],
    stars: Awaited<ReturnType<DrizzlePlanetsRepository['starsQuery']>>,
  ): Planet {
    return DrizzlePlanetMapper.toEntity({
      ...row,
      stars: stars.filter((star) => star.planetId === row.id),
    })
  }

  private async hydratePlanets(
    rows: Awaited<ReturnType<DrizzlePlanetsRepository['planetsQuery']>>,
  ): Promise<Planet[]> {
    if (!rows.length) return []
    const stars = await this.starsQuery(rows.map((row) => row.id))
    return rows.map((row) => this.mapPlanet(row, stars))
  }

  private findPlanets(filter?: SQL, last = false): Promise<Planet[]> {
    return this.executeQuery(async () =>
      this.hydratePlanets(await this.planetsQuery(filter, last)),
    )
  }

  async findAll(): Promise<Planet[]> {
    return this.findPlanets()
  }

  async findById(id: Id): Promise<Planet | null> {
    return (await this.findPlanets(eq(planetModel.id, id.value)))[0] ?? null
  }

  async findByPosition(position: OrdinalNumber): Promise<Planet | null> {
    return (await this.findPlanets(eq(planetModel.position, position.value)))[0] ?? null
  }

  private starPlanetQuery(starId: Id) {
    return this.database
      .select({ planetId: starModel.planetId })
      .from(starModel)
      .where(eq(starModel.id, starId.value))
  }

  async findByStar(starId: Id): Promise<Planet | null> {
    return (
      (
        await this.findPlanets(inArray(planetModel.id, this.starPlanetQuery(starId)))
      )[0] ?? null
    )
  }

  async findLastPlanet(): Promise<Planet | null> {
    return (await this.findPlanets(undefined, true))[0] ?? null
  }

  async add(planet: Planet): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database
        .insert(planetModel)
        .values(DrizzlePlanetMapper.toPersistence(planet))
    })
  }

  async replace(planet: Planet): Promise<void> {
    await this.replaceMany([planet])
  }

  async replaceMany(planets: Planet[]): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database.transaction(async (transaction) => {
        for (const planet of planets)
          await transaction
            .update(planetModel)
            .set(DrizzlePlanetMapper.toPersistence(planet))
            .where(eq(planetModel.id, planet.id.value))
      })
    })
  }

  async remove(planetId: Id): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database.delete(planetModel).where(eq(planetModel.id, planetId.value))
    })
  }
}
