import type { PaginationResponse, RestResponse } from '@/global/responses'
import type {
  ChallengeCategoryDto,
  ChallengeDto,
  DocDto,
  SolutionDto,
} from '../domain/entities/dtos'
import type {
  ChallengesListParams,
  ChallengeVote,
  SolutionsListParams,
} from '../domain/types'
import type { Challenge, ChallengeCategory, Solution } from '../domain/entities'

export interface ChallengingService {
  fetchChallengeById(challengeId: string): Promise<RestResponse<ChallengeDto>>
  fetchChallengeBySlug(challengeSlug: string): Promise<RestResponse<ChallengeDto>>
  fetchChallengeByStarId(starId: string): Promise<RestResponse<ChallengeDto>>
  fetchChallengeBySolutionId(solutionId: string): Promise<RestResponse<ChallengeDto>>
  fetchCompletableChallenges(
    userId: string,
  ): Promise<RestResponse<{ id: string; difficulty: string }[]>>
  fetchDocs(): Promise<RestResponse<DocDto[]>>
  fetchSolutionById(solutionId: string): Promise<RestResponse<SolutionDto>>
  fetchSolutionBySlug(solutionSlug: string): Promise<RestResponse<SolutionDto>>
  fetchChallengesList(
    params: ChallengesListParams,
  ): Promise<RestResponse<PaginationResponse<ChallengeDto>>>
  fetchSolutionsList(
    params: SolutionsListParams,
  ): Promise<RestResponse<PaginationResponse<SolutionDto>>>
  fetchCategories(): Promise<RestResponse<ChallengeCategoryDto[]>>
  fetchChallengeVote(
    challengeId: string,
    userId: string,
  ): Promise<RestResponse<{ challengeVote: ChallengeVote }>>
  saveChallenge(challenge: Challenge): Promise<RestResponse>
  saveChallengeCategories(
    challengeId: string,
    challengeCategories: ChallengeCategory[],
  ): Promise<RestResponse>
  deleteChallengeCategories(challengeId: string): Promise<RestResponse>
  saveSolution(solution: Solution, challengeId: string): Promise<RestResponse>
  updateSolution(solution: Solution): Promise<RestResponse>
  updateChallenge(challenge: Challenge): Promise<RestResponse>
  deleteSolution(solutionId: string): Promise<RestResponse>
  deleteChallenge(challengeId: string): Promise<RestResponse>
  saveCompletedChallenge(challengeId: string, userId: string): Promise<RestResponse>
  saveChallengeVote(
    challengeId: string,
    userId: string,
    challengeVote: ChallengeVote,
  ): Promise<RestResponse>
  saveSolutionUpvote(solutionId: string, userId: string): Promise<RestResponse>
  updateChallengeVote(
    challengeId: string,
    userId: string,
    challengeVote: ChallengeVote,
  ): Promise<RestResponse>
  deleteChallengeVote(challengeId: string, userId: string): Promise<RestResponse>
  deleteSolutionUpvote(solutionId: string, userId: string): Promise<RestResponse>
}
