import type { ChallengeCategoryDto, ChallengeDto, DocDto } from '#challenging/dtos'
import type { ChallengesListParams } from '#challenging/types'
import type { IChallengingService } from '#interfaces'
import { ApiResponse } from '#responses'

export class ChallengingServiceMock implements IChallengingService {
  challenges: ChallengeDto[] = []

  fetchChallengeBySlug(challengeId: string): Promise<ApiResponse<ChallengeDto>> {
    throw new Error('Method not implemented.')
  }

  fetchChallengeSlugByStarId(starId: string): Promise<ApiResponse<string>> {
    throw new Error('Method not implemented.')
  }

  async fetchChallengesWithOnlyDifficulty(): Promise<
    ApiResponse<{ id: string; difficulty: string }[]>
  > {
    return new ApiResponse({
      body: this.challenges.map(({ id, difficulty }) => ({ id: id ?? '', difficulty })),
    })
  }

  fetchChallengesList(
    params: ChallengesListParams,
  ): Promise<ApiResponse<ChallengeDto[]>> {
    throw new Error('Method not implemented.')
  }

  fetchCategories(): Promise<ApiResponse<ChallengeCategoryDto[]>> {
    throw new Error('Method not implemented.')
  }

  fetchDocs(): Promise<ApiResponse<DocDto[]>> {
    throw new Error('Method not implemented.')
  }
  saveUnlockedDoc(docId: string, userId: string): Promise<ApiResponse<true>> {
    throw new Error('Method not implemented.')
  }
}
