import { ChallengeSource } from '@stardust/core/challenging/entities'

import type { SupabaseChallengeSource } from '../../types'

export class SupabaseChallengeSourceMapper {
  static toEntity(supabaseChallengeSource: SupabaseChallengeSource): ChallengeSource {
    const challenge = supabaseChallengeSource.challenges
      ? {
          id: supabaseChallengeSource.challenges.id,
          title: supabaseChallengeSource.challenges.title,
          slug: supabaseChallengeSource.challenges.slug,
        }
      : null

    return ChallengeSource.create({
      id: supabaseChallengeSource.id,
      url: supabaseChallengeSource.url,
      position: supabaseChallengeSource.position,
      additionalInstructions: supabaseChallengeSource.additional_instructions ?? null,
      challenge,
    })
  }

  static toSupabase(challengeSource: ChallengeSource) {
    const challenge = challengeSource.challenge

    return {
      id: challengeSource.id.value,
      url: challengeSource.url.value,
      challenge_id: challenge ? challenge.id.value : null,
      position: challengeSource.position.value,
      additional_instructions: challengeSource.additionalInstructions
        ? challengeSource.additionalInstructions.value
        : null,
    }
  }
}
