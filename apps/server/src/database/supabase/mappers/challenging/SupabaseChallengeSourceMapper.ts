import { ChallengeSource } from '@stardust/core/challenging/entities'

import type { SupabaseChallengeSource } from '../../types'

export class SupabaseChallengeSourceMapper {
  static toEntity(supabaseChallengeSource: SupabaseChallengeSource): ChallengeSource {
    return ChallengeSource.create({
      id: supabaseChallengeSource.id,
      url: supabaseChallengeSource.url,
      isUsed: Boolean(supabaseChallengeSource.is_used),
      position: supabaseChallengeSource.position,
      challenge: {
        id:
          supabaseChallengeSource.challenges?.id ??
          supabaseChallengeSource.challenge_id ??
          supabaseChallengeSource.id,
        title: supabaseChallengeSource.challenges?.title ?? 'Sem título',
        slug:
          supabaseChallengeSource.challenges?.slug ??
          `source-${supabaseChallengeSource.id}`,
      },
    })
  }

  static toSupabase(challengeSource: ChallengeSource) {
    return {
      id: challengeSource.id.value,
      url: challengeSource.url.value,
      challenge_id: challengeSource.challenge.id.value,
      is_used: challengeSource.isUsed.value,
      position: challengeSource.position.value,
    }
  }
}
