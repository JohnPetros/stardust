import type { ChallengeCategoryDto, ChallengeDto, DocDto } from '#challenging/dtos'
import type { ChallengesListParams, ChallengeVote } from '#challenging/types'
import type { PaginationResponse } from '#responses'
import type { ApiResponse } from '../../responses/ApiResponse'

export type GetFilteredChallengesParams = {
  userId: string
  status: string
  difficulty: string
  title: string
  categoriesIds: string[]
}

export interface IChallengingService {
  fetchChallengeById(challengeId: string): Promise<ApiResponse<ChallengeDto>>
  fetchChallengeBySlug(challengeSlug: string): Promise<ApiResponse<ChallengeDto>>
  fetchChallengeByStarId(starId: string): Promise<ApiResponse<ChallengeDto>>
  fetchChallengesWithOnlyDifficulty(): Promise<
    ApiResponse<{ id: string; difficulty: string }[]>
  >
  fetchDocs(): Promise<ApiResponse<DocDto[]>>
  fetchChallengesList(
    params: ChallengesListParams,
  ): Promise<ApiResponse<PaginationResponse<ChallengeDto>>>
  fetchCategories(): Promise<ApiResponse<ChallengeCategoryDto[]>>
  fetchChallengeVote(
    challengeId: string,
    userId: string,
  ): Promise<ApiResponse<{ challengeVote: ChallengeVote }>>
  saveUnlockedDoc(docId: string, userId: string): Promise<ApiResponse>
  saveCompletedChallenge(challengeId: string, userId: string): Promise<ApiResponse>
  saveChallengeVote(
    challengeId: string,
    userId: string,
    challengeVote: ChallengeVote,
  ): Promise<ApiResponse>
  updateChallengeVote(
    challengeId: string,
    userId: string,
    challengeVote: ChallengeVote,
  ): Promise<ApiResponse>
  deleteChallengeVote(challengeId: string, userId: string): Promise<ApiResponse>
}
