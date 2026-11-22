import type { SupabaseClient } from '@supabase/supabase-js'
import { eq, inArray } from 'drizzle-orm'
import {
  GalaxiesFaker,
  PlanetsFaker,
  StarsFaker,
} from '@stardust/core/space/entities/fakers'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { galaxyModel, planetModel, starModel } from '@/database/drizzle/schema'

export type CreatedGalaxy = {
  id: string
  slug: string
  name: string
  position: number
  status: 'published' | 'announced' | 'unpublished'
}
export type SuspendedGalaxy = Pick<CreatedGalaxy, 'id' | 'position' | 'status'>
const SUSPENDED_POSITION_OFFSET = 1_000_000

export type CreatedPlanet = {
  id: string
  galaxyId: string
  position: number
}
export type CreatedStar = {
  id: string
  planetId: string
  galaxyId: string
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

  async createGalaxy(overrides: Partial<CreatedGalaxy> = {}): Promise<CreatedGalaxy> {
    const galaxy = GalaxiesFaker.fakeDto({
      position: Math.floor(Math.random() * 100000) + 1000,
      ...overrides,
    })
    const [persisted] = await this.database
      .insert(galaxyModel)
      .values({
        id: galaxy.id,
        slug: galaxy.slug,
        name: galaxy.name,
        description: galaxy.description,
        animation: galaxy.animation,
        position: galaxy.position,
        status: galaxy.status,
      })
      .returning()
    return {
      id: persisted.id,
      slug: persisted.slug,
      name: persisted.name,
      position: persisted.position,
      status: persisted.status,
    }
  }

  async createPlanet(
    galaxyId: string,
    overrides: Partial<Pick<CreatedPlanet, 'position'>> & {
      concept?: string | null
    } = {},
  ): Promise<CreatedPlanet> {
    const planet = PlanetsFaker.fakeDto({
      position: Math.floor(Math.random() * 100000) + 1000,
      stars: [],
      ...overrides,
    })
    const [persisted] = await this.database
      .insert(planetModel)
      .values({
        id: planet.id,
        name: planet.name,
        image: planet.image,
        position: planet.position,
        concept: overrides.concept ?? null,
        galaxyId,
      })
      .returning()
    return {
      id: persisted.id,
      galaxyId: persisted.galaxyId,
      position: persisted.position,
    }
  }

  async createStar(
    galaxyId?: string,
    overrides: { planetId?: string; number?: number; description?: string | null } = {},
  ): Promise<CreatedStar> {
    const galaxy = galaxyId ? { id: galaxyId } : await this.createGalaxy()
    const planet = overrides.planetId
      ? { id: overrides.planetId }
      : await this.createPlanet(galaxy.id)
    const star = StarsFaker.fakeDto({
      number: overrides.number ?? Math.floor(Math.random() * 100000) + 1,
      isChallenge: false,
      description: overrides.description ?? null,
    })
    const [persistedStar] = await this.database
      .insert(starModel)
      .values({
        id: star.id,
        name: star.name,
        number: star.number,
        slug: star.slug,
        isChallenge: star.isChallenge,
        description: star.description ?? null,
        planetId: planet.id,
      })
      .returning()
    return {
      id: persistedStar.id,
      planetId: persistedStar.planetId,
      galaxyId: galaxy.id,
      name: persistedStar.name,
      slug: persistedStar.slug,
      number: persistedStar.number,
      isAvailable: persistedStar.isAvailable,
      isChallenge: persistedStar.isChallenge,
    }
  }

  private readonly suspendedRegistry = new Map<string, SuspendedGalaxy>()

  async suspendExistingGalaxies(): Promise<SuspendedGalaxy[]> {
    const galaxies = await this.database
      .select({
        id: galaxyModel.id,
        position: galaxyModel.position,
        status: galaxyModel.status,
      })
      .from(galaxyModel)
    for (const galaxy of galaxies) {
      if (!this.suspendedRegistry.has(galaxy.id)) {
        this.suspendedRegistry.set(galaxy.id, galaxy)
      }
      await this.database
        .update(galaxyModel)
        .set({
          status: 'unpublished',
          position: galaxy.position + SUSPENDED_POSITION_OFFSET,
        })
        .where(eq(galaxyModel.id, galaxy.id))
    }
    return galaxies
  }

  async restoreSuspendedGalaxies(galaxies: SuspendedGalaxy[]): Promise<void> {
    for (const galaxy of galaxies) {
      await this.database
        .update(galaxyModel)
        .set({ status: galaxy.status, position: galaxy.position })
        .where(eq(galaxyModel.id, galaxy.id))
      this.suspendedRegistry.delete(galaxy.id)
    }
  }

  /** Idempotent safety net: restores every galaxy still suspended by this fixture. */
  async restoreAllSuspendedGalaxies(): Promise<void> {
    await this.restoreSuspendedGalaxies([...this.suspendedRegistry.values()])
  }

  async cleanupCreatedGalaxies(galaxies: CreatedGalaxy[]): Promise<void> {
    if (!galaxies.length) return
    const ids = galaxies.map((galaxy) => galaxy.id)
    await this.database.transaction(async (transaction) => {
      await transaction.delete(planetModel).where(inArray(planetModel.galaxyId, ids))
      await transaction.delete(galaxyModel).where(inArray(galaxyModel.id, ids))
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
      await transaction.delete(galaxyModel).where(
        inArray(
          galaxyModel.id,
          stars.map((star) => star.galaxyId),
        ),
      )
    })
  }
}
