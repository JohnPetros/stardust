import type { Id } from '@stardust/core/global/structures'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import type { Challenge } from '@stardust/core/challenging/entities'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseChallengeMapper } from '../../mappers/challenging'

export class SupabaseChallengesRepository
  extends SupabaseRepository
  implements ChallengesRepository
{
  async findById(challengeId: Id): Promise<Challenge | null> {
    const { data, error } = await this.supabase
      .from('challenges_view')
      .select('*')
      .eq('id', challengeId.value)
      .single()

    if (error) {
      return null
    }

    return SupabaseChallengeMapper.toEntity(data)
  }
}
