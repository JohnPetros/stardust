import { ChallengeSource } from '@stardust/core/challenging/entities'
import type {
  DrizzleChallengeSource,
  DrizzleInsertChallengeSource,
} from '../../types/entities/challenging'
export class DrizzleChallengeSourceMapper {
  static toEntity(row: DrizzleChallengeSource): ChallengeSource {
    return ChallengeSource.create({
      id: row.id,
      ...DrizzleChallengeSourceMapper.content(row),
      position: row.position,
      challenge: row.challenge,
    })
  }
  static toPersistence(source: ChallengeSource): DrizzleInsertChallengeSource {
    return {
      id: source.id.value,
      ...DrizzleChallengeSourceMapper.persistenceContent(source),
      position: source.position.value,
      challengeId: source.challenge?.id.value ?? null,
    }
  }
  private static content(
    row: DrizzleChallengeSource,
  ): Pick<DrizzleChallengeSource, 'url' | 'additionalInstructions'> {
    const { url, additionalInstructions } = row
    return { url, additionalInstructions }
  }
  private static persistenceContent(
    source: ChallengeSource,
  ): Pick<DrizzleInsertChallengeSource, 'url' | 'additionalInstructions'> {
    return {
      url: source.url.value,
      additionalInstructions: source.additionalInstructions?.value ?? null,
    }
  }
}
