import type { SupabaseClient } from '@supabase/supabase-js'

import { PlanetsFaker, StarsFaker } from '@stardust/core/space/entities/fakers'

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
  constructor(private readonly supabase: SupabaseClient) {}

  async createStar(): Promise<CreatedStar> {
    const planet = PlanetsFaker.fakeDto({
      position: Math.floor(Math.random() * 100000) + 1000,
      stars: [],
    })

    const planetResponse = await this.supabase.from('planets').insert({
      id: planet.id,
      name: planet.name,
      icon: planet.icon,
      image: planet.image,
      position: planet.position,
    })

    if (planetResponse.error) {
      throw planetResponse.error
    }

    const star = StarsFaker.fakeDto({
      number: Math.floor(Math.random() * 100000) + 1,
    })
    const starResponse = await this.supabase.from('stars').insert({
      id: star.id,
      name: star.name,
      number: star.number,
      slug: star.slug,
      is_challenge: star.isChallenge,
      planet_id: planet.id,
    })

    if (starResponse.error) {
      throw starResponse.error
    }

    const persistedStarResponse = await this.supabase
      .from('stars')
      .select('id, name, number, slug, is_available, is_challenge, planet_id')
      .eq('id', star.id ?? '')
      .single()

    if (persistedStarResponse.error) {
      throw persistedStarResponse.error
    }

    const persistedStar = persistedStarResponse.data

    return {
      id: persistedStar.id,
      planetId: persistedStar.planet_id,
      name: persistedStar.name,
      slug: persistedStar.slug,
      number: persistedStar.number,
      isAvailable: persistedStar.is_available,
      isChallenge: persistedStar.is_challenge,
    }
  }

  async cleanupCreatedStars(stars: CreatedStar[]): Promise<void> {
    const starIds = stars.map((star) => star.id)
    const planetIds = stars.map((star) => star.planetId)

    if (starIds.length > 0) {
      await this.supabase.from('stars').delete().in('id', starIds)
    }

    if (planetIds.length > 0) {
      await this.supabase.from('planets').delete().in('id', planetIds)
    }
  }
}
