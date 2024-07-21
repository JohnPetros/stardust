import type { ChallengeDTO } from '@/@core/dtos'
import type { IChallengesService } from '@/@core/interfaces/services'
import { ServiceResponse } from '@/@core/responses'

export class ChallengesServiceMock implements IChallengesService {
  challenges: ChallengeDTO[] = []

  fetchChallengeBySlug(challengeId: string): Promise<ServiceResponse<ChallengeDTO>> {
    throw new Error('Method not implemented.')
  }

  fetchChallengeSlugByStarId(starId: string): Promise<ServiceResponse<string>> {
    throw new Error('Method not implemented.')
  }

  async fetchChallengesWithOnlyDifficulty(): Promise<
    ServiceResponse<{ id: string; difficulty: string }[]>
  > {
    return new ServiceResponse(
      this.challenges.map(({ id, difficulty }) => ({ id: id ?? '', difficulty }))
    )
  }
}
