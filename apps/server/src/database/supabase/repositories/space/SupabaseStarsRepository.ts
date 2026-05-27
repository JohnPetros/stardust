import type { StarsRepository } from '@stardust/core/space/interfaces'
import type { Id, OrdinalNumber, Slug } from '@stardust/core/global/structures'
import type { Star } from '@stardust/core/space/entities'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseStarMapper } from '../../mappers/space'
import { SupabasePostgreError } from '../../errors'
import type { SupabaseStar } from '../../types'

type SupabaseStarFallbackRow = Partial<SupabaseStar> & {
  id: string
  name: string
  number: number
  slug: string
  is_challenge: boolean
}

export class SupabaseStarsRepository
  extends SupabaseRepository
  implements StarsRepository
{
  private shouldFallbackStarAvailability(error: { message: string } | null) {
    return Boolean(
      error?.message.includes("Could not find the 'is_available' column") ||
        error?.message.includes('column stars.is_available does not exist'),
    )
  }

  private toEntityWithFallback(
    supabaseStar: Partial<SupabaseStar> & {
      id: string
      name: string
      number: number
      slug: string
      is_challenge: boolean
    },
  ) {
    return SupabaseStarMapper.toEntity({
      id: supabaseStar.id,
      name: supabaseStar.name,
      number: supabaseStar.number,
      slug: supabaseStar.slug,
      is_available: supabaseStar.is_available ?? false,
      is_challenge: supabaseStar.is_challenge,
      user_count: supabaseStar.user_count ?? 0,
      unlock_count: supabaseStar.unlock_count ?? 0,
    })
  }

  async findAllOrdered(): Promise<Star[]> {
    const primaryResponse = await this.supabase
      .from('stars')
      .select('id, name, number, slug, is_available, is_challenge')
      .order('id', { ascending: true })
      .overrideTypes<SupabaseStar[]>()

    let data =
      (primaryResponse.data as unknown as SupabaseStarFallbackRow[] | null) ?? null
    let error = primaryResponse.error

    if (this.shouldFallbackStarAvailability(error)) {
      const fallbackResponse = await this.supabase
        .from('stars')
        .select('id, name, number, slug, is_challenge')
        .order('id', { ascending: true })

      data =
        (fallbackResponse.data as unknown as SupabaseStarFallbackRow[] | null) ?? null
      error = fallbackResponse.error
    }

    if (error) {
      throw new SupabasePostgreError(error)
    }

    if (!data) {
      return []
    }

    return data.map((star) => this.toEntityWithFallback(star))
  }

  async findById(starId: Id): Promise<Star | null> {
    const primaryResponse = await this.supabase
      .from('stars')
      .select('id, name, number, slug, is_available, is_challenge')
      .eq('id', starId.value)
      .single<SupabaseStar>()

    let data = (primaryResponse.data as unknown as SupabaseStarFallbackRow | null) ?? null
    let error = primaryResponse.error

    if (this.shouldFallbackStarAvailability(error)) {
      const fallbackResponse = await this.supabase
        .from('stars')
        .select('id, name, number, slug, is_challenge')
        .eq('id', starId.value)
        .single<SupabaseStar>()

      data = (fallbackResponse.data as unknown as SupabaseStarFallbackRow | null) ?? null
      error = fallbackResponse.error
    }

    if (error) {
      return null
    }

    if (!data) {
      return null
    }

    return this.toEntityWithFallback(data)
  }

  async findBySlug(starSlug: Slug): Promise<Star | null> {
    const primaryResponse = await this.supabase
      .from('stars')
      .select('id, name, number, slug, is_available, is_challenge')
      .eq('slug', starSlug.value)
      .single<SupabaseStar>()

    let data = (primaryResponse.data as unknown as SupabaseStarFallbackRow | null) ?? null
    let error = primaryResponse.error

    if (this.shouldFallbackStarAvailability(error)) {
      const fallbackResponse = await this.supabase
        .from('stars')
        .select('id, name, number, slug, is_challenge')
        .eq('slug', starSlug.value)
        .single<SupabaseStar>()

      data = (fallbackResponse.data as unknown as SupabaseStarFallbackRow | null) ?? null
      error = fallbackResponse.error
    }

    if (error) {
      return null
    }

    if (!data) {
      return null
    }

    return this.toEntityWithFallback(data)
  }

  async findByNumber(number: OrdinalNumber): Promise<Star | null> {
    const primaryResponse = await this.supabase
      .from('stars')
      .select('id, name, number, slug, is_available, is_challenge')
      .eq('number', number.value)
      .order('number', { ascending: true })
      .single<SupabaseStar>()

    let data = (primaryResponse.data as unknown as SupabaseStarFallbackRow | null) ?? null
    let error = primaryResponse.error

    if (this.shouldFallbackStarAvailability(error)) {
      const fallbackResponse = await this.supabase
        .from('stars')
        .select('id, name, number, slug, is_challenge')
        .eq('number', number.value)
        .order('number', { ascending: true })
        .single<SupabaseStar>()

      data = (fallbackResponse.data as unknown as SupabaseStarFallbackRow | null) ?? null
      error = fallbackResponse.error
    }

    if (error) {
      return null
    }

    if (!data) {
      return null
    }

    return this.toEntityWithFallback(data)
  }

  async add(star: Star, planetId: Id): Promise<void> {
    const primaryResponse = await this.supabase.from('stars').insert({
      id: star.id.value,
      planet_id: planetId.value,
      name: star.name.value,
      number: star.number.value,
      slug: star.slug.value,
      is_available: star.isAvailable.value,
      is_challenge: star.isChallenge.value,
    })

    let error = primaryResponse.error

    if (this.shouldFallbackStarAvailability(error)) {
      const fallbackResponse = await this.supabase.from('stars').insert({
        id: star.id.value,
        planet_id: planetId.value,
        name: star.name.value,
        number: star.number.value,
        slug: star.slug.value,
        is_challenge: star.isChallenge.value,
      })

      error = fallbackResponse.error
    }

    if (error) throw new SupabasePostgreError(error)
  }

  async replace(star: Star): Promise<void> {
    const supabaseStar = SupabaseStarMapper.toSupabase(star)
    const { error } = await this.supabase
      .from('stars')
      .update({
        name: supabaseStar.name,
        number: supabaseStar.number,
        slug: supabaseStar.slug,
        is_available: supabaseStar.is_available,
        is_challenge: supabaseStar.is_challenge,
      })
      .eq('id', star.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replaceMany(stars: Star[]): Promise<void> {
    await Promise.all(stars.map((star) => this.replace(star)))
  }

  async remove(starId: Id): Promise<void> {
    const { error } = await this.supabase.from('stars').delete().eq('id', starId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
