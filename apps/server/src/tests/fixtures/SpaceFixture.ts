import type { SupabaseClient } from '@supabase/supabase-js'
import { inArray } from 'drizzle-orm'
import { PlanetsFaker, StarsFaker } from '@stardust/core/space/entities/fakers'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { planetModel, starModel } from '@/database/drizzle/schema'

export type CreatedStar = {
  id: string
  planetId: string
  name: string
  slug: string
  number: number
  isAvailable: boolean
  isChallenge: boolean
}
export class SpaceFixture {
  constructor(_supabase: SupabaseClient) {}
  private get database() {
    return DrizzleClient.getInstance()
  }

  async createStar(): Promise<CreatedStar> {
    const planet = PlanetsFaker.fakeDto({
      position: Math.floor(Math.random() * 100000) + 1000,
      stars: [],
    })
    const star = StarsFaker.fakeDto({ number: Math.floor(Math.random() * 100000) + 1 })
    return await this.database.transaction(async (transaction) => {
      const [persistedPlanet] = await transaction
        .insert(planetModel)
        .values({
          id: planet.id,
          name: planet.name,
          icon: planet.icon,
          image: planet.image,
          position: planet.position,
        })
        .returning()
      const [persistedStar] = await transaction
        .insert(starModel)
        .values({
          id: star.id,
          name: star.name,
          number: star.number,
          slug: star.slug,
          isChallenge: star.isChallenge,
          planetId: persistedPlanet.id,
        })
        .returning()
      return {
        id: persistedStar.id,
        planetId: persistedStar.planetId,
        name: persistedStar.name,
        slug: persistedStar.slug,
        number: persistedStar.number,
        isAvailable: persistedStar.isAvailable,
        isChallenge: persistedStar.isChallenge,
      }
    })
  }
  async cleanupCreatedStars(stars: CreatedStar[]): Promise<void> {
    if (!stars.length) return
    await this.database.transaction(async (transaction) => {
      await transaction.delete(starModel).where(
        inArray(
          starModel.id,
          stars.map((star) => star.id),
        ),
      )
      await transaction.delete(planetModel).where(
        inArray(
          planetModel.id,
          stars.map((star) => star.planetId),
        ),
      )
    })
  }
}
