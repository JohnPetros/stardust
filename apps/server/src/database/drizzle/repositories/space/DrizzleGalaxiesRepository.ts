import { asc, eq, getTableColumns, sql, type SQL } from 'drizzle-orm'
import type { Galaxy } from '@stardust/core/space/entities'
import type { GalaxiesRepository } from '@stardust/core/space/interfaces'
import type { Slug } from '@stardust/core/global/structures'
import { DrizzleRepository } from '../../DrizzleRepository'
import { galaxyModel } from '../../models/space/galaxy-model'
import { planetModel } from '../../models/space/planet-model'
import { DrizzleGalaxyMapper } from '../../mappers/space/DrizzleGalaxyMapper'

export class DrizzleGalaxiesRepository
  extends DrizzleRepository
  implements GalaxiesRepository
{
  private galaxyProjection() {
    return {
      ...getTableColumns(galaxyModel),
      planetsIds: sql<
        string[]
      >`coalesce(array_agg(${planetModel.id} order by ${planetModel.position}) filter (where ${planetModel.id} is not null), '{}')::text[]`,
    }
  }

  private galaxiesQuery(filter: SQL | undefined) {
    return this.database
      .select(this.galaxyProjection())
      .from(galaxyModel)
      .leftJoin(planetModel, eq(planetModel.galaxyId, galaxyModel.id))
      .where(filter)
      .groupBy(galaxyModel.id)
      .orderBy(asc(galaxyModel.position))
  }

  private findGalaxies(filter?: SQL, limit?: number): Promise<Galaxy[]> {
    return this.findManyResults(async () => {
      const query = this.galaxiesQuery(filter)
      return limit ? query.limit(limit) : query
    }, DrizzleGalaxyMapper.toEntity)
  }

  async findAll(): Promise<Galaxy[]> {
    return this.findGalaxies()
  }

  async findBySlug(slug: Slug): Promise<Galaxy | null> {
    return (await this.findGalaxies(eq(galaxyModel.slug, slug.value), 1))[0] ?? null
  }

  async findFirst(): Promise<Galaxy | null> {
    return (await this.findGalaxies(undefined, 1))[0] ?? null
  }
}
