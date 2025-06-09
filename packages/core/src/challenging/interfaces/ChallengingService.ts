import type {
  ChallengeCategoryDto,
  ChallengeDto,
  DocDto,
  SolutionDto,
} from '../domain/entities/dtos'
import type {
  ChallengesListParams,
  ChallengeVote,
  CompletedChallengesCountByDifficultyLevel,
} from '../domain/types'
import type { Challenge, ChallengeCategory, Solution } from '../domain/entities'
import type { SolutionsListingParams } from '../domain/types'
import type { PaginationResponse, RestResponse } from '#global/responses/index'
import type { Id, Slug } from '#global/domain/structures/index'

export interface ChallengingService {
  fetchChallengeById(challengeId: Id): Promise<RestResponse<ChallengeDto>>
  fetchChallengeBySlug(challengeSlug: Slug): Promise<RestResponse<ChallengeDto>>
  fetchCompletedChallengesByDifficultyLevel(): Promise<
    RestResponse<CompletedChallengesCountByDifficultyLevel>
  >
  fetchChallengeByStarId(starId: Id): Promise<RestResponse<ChallengeDto>>
  fetchChallengeBySolutionId(solutionId: Id): Promise<RestResponse<ChallengeDto>>
  fetchDocs(): Promise<RestResponse<DocDto[]>>
  fetchSolutionById(solutionId: Id): Promise<RestResponse<SolutionDto>>
  fetchSolutionBySlug(solutionSlug: string): Promise<RestResponse<SolutionDto>>
  fetchChallengesList(
    params: ChallengesListParams,
  ): Promise<RestResponse<PaginationResponse<ChallengeDto>>>
  fetchSolutionsList(
    params: SolutionsListingParams,
  ): Promise<RestResponse<PaginationResponse<SolutionDto>>>
  fetchCategories(): Promise<RestResponse<ChallengeCategoryDto[]>>
  fetchChallengeVote(
    challengeId: Id,
    userId: Id,
  ): Promise<RestResponse<{ challengeVote: ChallengeVote }>>
  saveChallenge(challenge: Challenge): Promise<RestResponse>
  saveChallengeCategories(
    challengeId: Id,
    challengeCategories: ChallengeCategory[],
  ): Promise<RestResponse>
  deleteChallengeCategories(challengeId: Id): Promise<RestResponse>
  saveSolution(solution: Solution, challengeId: Id): Promise<RestResponse>
  updateSolution(solution: Solution): Promise<RestResponse>
  updateChallenge(challenge: Challenge): Promise<RestResponse>
  deleteSolution(solutionId: Id): Promise<RestResponse>
  deleteChallenge(challengeId: Id): Promise<RestResponse>
  saveCompletedChallenge(challengeId: Id, userId: Id): Promise<RestResponse>
  saveChallengeVote(
    challengeId: Id,
    userId: Id,
    challengeVote: ChallengeVote,
  ): Promise<RestResponse>
  saveSolutionUpvote(solutionId: Id, userId: Id): Promise<RestResponse>
  updateChallengeVote(
    challengeId: Id,
    userId: Id,
    challengeVote: ChallengeVote,
  ): Promise<RestResponse>
  deleteChallengeVote(challengeId: Id, userId: Id): Promise<RestResponse>
  deleteSolutionUpvote(solutionId: Id, userId: Id): Promise<RestResponse>
}
