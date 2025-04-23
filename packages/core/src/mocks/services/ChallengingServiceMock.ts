import type {
  ChallengeCategoryDto,
  ChallengeDto,
  DocDto,
  SolutionDto,
} from '../../challenging/dtos'
import type {
  Challenge,
  ChallengeCategory,
  Solution,
} from '../../challenging/domain/entities'
import type {
  ChallengesListParams,
  ChallengeVote,
  SolutionsListParams,
} from '../../challenging/domain/types'
import type { IChallengingService } from '../../global/interfaces'
import { RestResponse, type PaginationResponse } from '../../global/responses'

export class ChallengingServiceMock implements IChallengingService {
  challenges: ChallengeDto[] = []

  fetchChallengeBySlug(challengeId: string): Promise<RestResponse<ChallengeDto>> {
    throw new Error('Method not implemented.')
  }

  fetchChallengeSlugByStarId(starId: string): Promise<RestResponse<string>> {
    throw new Error('Method not implemented.')
  }

  async fetchCompletableChallenges(): Promise<
    RestResponse<{ id: string; difficulty: string }[]>
  > {
    return new RestResponse({
      body: this.challenges.map(({ id, difficultyLevel }) => ({
        id: id ?? '',
        difficulty: difficultyLevel,
      })),
    })
  }

  fetchChallengesList(
    params: ChallengesListParams,
  ): Promise<RestResponse<PaginationResponse<ChallengeDto>>> {
    throw new Error('Method not implemented.')
  }

  fetchCategories(): Promise<RestResponse<ChallengeCategoryDto[]>> {
    throw new Error('Method not implemented.')
  }

  fetchDocs(): Promise<RestResponse<DocDto[]>> {
    throw new Error('Method not implemented.')
  }

  fetchChallengeById(challengeId: string): Promise<RestResponse<ChallengeDto>> {
    throw new Error('Method not implemented.')
  }
  fetchChallengeByStarId(starId: string): Promise<RestResponse<ChallengeDto>> {
    throw new Error('Method not implemented.')
  }
  fetchChallengeBySolutionId(solutionId: string): Promise<RestResponse<ChallengeDto>> {
    throw new Error('Method not implemented.')
  }
  fetchSolutionById(solutionId: string): Promise<RestResponse<SolutionDto>> {
    throw new Error('Method not implemented.')
  }
  fetchSolutionBySlug(solutionSlug: string): Promise<RestResponse<SolutionDto>> {
    throw new Error('Method not implemented.')
  }
  fetchSolutionsList(
    params: SolutionsListParams,
  ): Promise<RestResponse<PaginationResponse<SolutionDto>>> {
    throw new Error('Method not implemented.')
  }
  fetchChallengeVote(
    challengeId: string,
    userId: string,
  ): Promise<RestResponse<{ challengeVote: ChallengeVote }>> {
    throw new Error('Method not implemented.')
  }
  saveChallenge(challenge: Challenge): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  saveChallengeCategories(
    challengeId: string,
    challengeCategories: ChallengeCategory[],
  ): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  deleteChallengeCategories(challengeId: string): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  saveSolution(solution: Solution, challengeId: string): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  updateSolution(solution: Solution): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  updateChallenge(challenge: Challenge): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  deleteSolution(solutionId: string): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  deleteChallenge(challengeId: string): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  saveCompletedChallenge(challengeId: string, userId: string): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  saveChallengeVote(
    challengeId: string,
    userId: string,
    challengeVote: ChallengeVote,
  ): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  saveSolutionUpvote(solutionId: string, userId: string): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  updateChallengeVote(
    challengeId: string,
    userId: string,
    challengeVote: ChallengeVote,
  ): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  deleteChallengeVote(challengeId: string, userId: string): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  deleteSolutionUpvote(solutionId: string, userId: string): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }

  saveUnlockedDoc(docId: string, userId: string): Promise<RestResponse<true>> {
    throw new Error('Method not implemented.')
  }
}
