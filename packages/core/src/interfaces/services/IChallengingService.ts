import type {
  ChallengeCategoryDto,
  ChallengeDto,
  DocDto,
  SolutionDto,
} from '#challenging/dtos'
import type { Solution } from '#challenging/entities'
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
  fetchSolutionBySlug(solutionSlug: string): Promise<ApiResponse<SolutionDto>>
  fetchChallengesList(
    params: ChallengesListParams,
  ): Promise<ApiResponse<PaginationResponse<ChallengeDto>>>
  fetchCategories(): Promise<ApiResponse<ChallengeCategoryDto[]>>
  fetchChallengeVote(
    challengeId: string,
    userId: string,
  ): Promise<ApiResponse<{ challengeVote: ChallengeVote }>>
  saveSolution(Solution: Solution, challengeId: string): Promise<ApiResponse>
  updateSolution(Solution: Solution): Promise<ApiResponse>
  deleteSolution(solutionId: string): Promise<ApiResponse>
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
