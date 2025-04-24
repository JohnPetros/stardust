import type {
  ChallengeCategoryDto,
  ChallengeDto,
  DocDto,
  SolutionDto,
} from '../../../challenging/dtos'
import type {
  Challenge,
  ChallengeCategory,
  Solution,
} from '../../../challenging/domain/entities'
import type {
  ChallengesListParams,
  ChallengeVote,
  SolutionsListParams,
} from '../../../challenging/domain/types'
import type { PaginationResponse } from '../../responses'
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
  fetchChallengeBySolutionId(solutionId: string): Promise<ApiResponse<ChallengeDto>>
  fetchCompletableChallenges(
    userId: string,
  ): Promise<ApiResponse<{ id: string; difficulty: string }[]>>
  fetchDocs(): Promise<ApiResponse<DocDto[]>>
  fetchSolutionById(solutionId: string): Promise<ApiResponse<SolutionDto>>
  fetchSolutionBySlug(solutionSlug: string): Promise<ApiResponse<SolutionDto>>
  fetchChallengesList(
    params: ChallengesListParams,
  ): Promise<ApiResponse<PaginationResponse<ChallengeDto>>>
  fetchSolutionsList(
    params: SolutionsListParams,
  ): Promise<ApiResponse<PaginationResponse<SolutionDto>>>
  fetchCategories(): Promise<ApiResponse<ChallengeCategoryDto[]>>
  fetchChallengeVote(
    challengeId: string,
    userId: string,
  ): Promise<ApiResponse<{ challengeVote: ChallengeVote }>>
  saveChallenge(challenge: Challenge): Promise<ApiResponse>
  saveChallengeCategories(
    challengeId: string,
    challengeCategories: ChallengeCategory[],
  ): Promise<ApiResponse>
  deleteChallengeCategories(challengeId: string): Promise<ApiResponse>
  saveSolution(solution: Solution, challengeId: string): Promise<ApiResponse>
  updateSolution(solution: Solution): Promise<ApiResponse>
  updateChallenge(challenge: Challenge): Promise<ApiResponse>
  deleteSolution(solutionId: string): Promise<ApiResponse>
  deleteChallenge(challengeId: string): Promise<ApiResponse>
  saveCompletedChallenge(challengeId: string, userId: string): Promise<ApiResponse>
  saveChallengeVote(
    challengeId: string,
    userId: string,
    challengeVote: ChallengeVote,
  ): Promise<ApiResponse>
  saveSolutionUpvote(solutionId: string, userId: string): Promise<ApiResponse>
  updateChallengeVote(
    challengeId: string,
    userId: string,
    challengeVote: ChallengeVote,
  ): Promise<ApiResponse>
  deleteChallengeVote(challengeId: string, userId: string): Promise<ApiResponse>
  deleteSolutionUpvote(solutionId: string, userId: string): Promise<ApiResponse>
}
