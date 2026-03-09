import type { ChallengeSourcesRepository } from '@stardust/core/challenging/interfaces'
import type { ChallengeSource } from '@stardust/core/challenging/entities'
import type { ChallengeSourcesListParams } from '@stardust/core/challenging/types'
import type { Id } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'

import { SupabasePostgreError } from '../../errors'
import { SupabaseChallengeSourceMapper } from '../../mappers/challenging'
import type { SupabaseChallengeSource } from '../../types'
import { SupabaseRepository } from '../SupabaseRepository'

export class SupabaseChallengeSourcesRepository
  extends SupabaseRepository
  implements ChallengeSourcesRepository
{
  async findNextNotUsed(): Promise<ChallengeSource | null> {
    const { data, error } = await this.supabase
      .from('challenge_sources')
      .select('*, challenges(id, title, slug)')
      .is('challenge_id', null)
      .order('position', { ascending: true })
      .limit(1)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseChallengeSourceMapper.toEntity(data as SupabaseChallengeSource)
  }

  async findById(challengeSourceId: Id): Promise<ChallengeSource | null> {
    const { data, error } = await this.supabase
      .from('challenge_sources')
      .select('*, challenges(id, title, slug)')
      .eq('id', challengeSourceId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseChallengeSourceMapper.toEntity(data as SupabaseChallengeSource)
  }

  async findByChallengeId(challengeId: Id): Promise<ChallengeSource | null> {
    const { data, error } = await this.supabase
      .from('challenge_sources')
      .select('*, challenges(id, title, slug)')
      .eq('challenge_id', challengeId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseChallengeSourceMapper.toEntity(data as SupabaseChallengeSource)
  }

  async findMany(
    params: ChallengeSourcesListParams,
  ): Promise<ManyItems<ChallengeSource>> {
    const { title, page, itemsPerPage, positionOrder } = params
    let query = this.supabase
      .from('challenge_sources')
      .select('*, challenges(id, title, slug)', { count: 'exact' })

    if (title.isEmpty.isFalse) {
      query = query.ilike('challenges.title', `%${title.value}%`)
    }

    if (positionOrder.isAny.isFalse) {
      query = query.order('position', { ascending: positionOrder.isAscending.isTrue })
    } else {
      query = query.order('position', { ascending: true })
    }

    const range = this.calculateQueryRange(page.value, itemsPerPage.value)
    const { data, count, error } = await query.range(range.from, range.to)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return {
      items: data.map((item) => SupabaseChallengeSourceMapper.toEntity(item)),
      count: count ?? 0,
    }
  }

  async add(challengeSource: ChallengeSource): Promise<void> {
    const { error } = await this.supabase
      .from('challenge_sources')
      .insert(SupabaseChallengeSourceMapper.toSupabase(challengeSource))

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async findAll(): Promise<ChallengeSource[]> {
    const { data, error } = await this.supabase
      .from('challenge_sources')
      .select('*, challenges(id, title, slug)')
      .order('position', { ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map((item) => SupabaseChallengeSourceMapper.toEntity(item))
  }

  async replaceMany(challengeSources: ChallengeSource[]): Promise<void> {
    for (let index = 0; index < challengeSources.length; index++) {
      const challengeSource = challengeSources[index]
      const temporaryPosition = 1_000_000 + index

      const { error } = await this.supabase
        .from('challenge_sources')
        .update({ position: temporaryPosition })
        .eq('id', challengeSource.id.value)

      if (error) {
        throw new SupabasePostgreError(error)
      }
    }

    for (const challengeSource of challengeSources) {
      const challenge = challengeSource.challenge

      const { error } = await this.supabase
        .from('challenge_sources')
        .update({
          position: challengeSource.position.value,
          challenge_id: challenge ? challenge.id.value : null,
          url: challengeSource.url.value,
        })
        .eq('id', challengeSource.id.value)

      if (error) {
        throw new SupabasePostgreError(error)
      }
    }
  }

  async replace(challengeSource: ChallengeSource): Promise<void> {
    const challenge = challengeSource.challenge

    const { error } = await this.supabase
      .from('challenge_sources')
      .update({
        position: challengeSource.position.value,
        challenge_id: challenge ? challenge.id.value : null,
        url: challengeSource.url.value,
      })
      .eq('id', challengeSource.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async remove(challengeSourceId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('challenge_sources')
      .delete()
      .eq('id', challengeSourceId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
