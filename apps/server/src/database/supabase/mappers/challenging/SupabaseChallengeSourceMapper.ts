import { ChallengeSource } from '@stardust/core/challenging/entities'

import type { SupabaseChallengeSource } from '../../types'

export class SupabaseChallengeSourceMapper {
  static toEntity(supabaseChallengeSource: SupabaseChallengeSource): ChallengeSource {
    const challengeId =
      supabaseChallengeSource.challenges?.id ?? supabaseChallengeSource.challenge_id

    if (!challengeId) {
      throw new Error(
        `SupabaseChallengeSourceMapper.toEntity: missing challenge_id and challenges join for ChallengeSource ${supabaseChallengeSource.id}`,
      )
    }

    const challengeTitle = supabaseChallengeSource.challenges?.title ?? ''
    const challengeSlug = supabaseChallengeSource.challenges?.slug ?? ''

    return ChallengeSource.create({
      id: supabaseChallengeSource.id,
      url: supabaseChallengeSource.url,
      isUsed: supabaseChallengeSource.is_used,
      position: supabaseChallengeSource.position,
      challenge: {
        id: challengeId,
        title: challengeTitle,
        slug: challengeSlug,
      },
    })
  }

  static toSupabase(challengeSource: ChallengeSource) {
    const challenge = challengeSource.challenge

    return {
      id: challengeSource.id.value,
      url: challengeSource.url.value,
      challenge_id: challenge ? challenge.id.value : null,
      is_used: Boolean(challenge),
      position: challengeSource.position.value,
    }
  }
}
