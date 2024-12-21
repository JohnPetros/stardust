import type { ChallengeDto, DocDto } from '#dtos'
import type { ApiResponse } from '../../responses/ApiResponse'

export type GetFilteredChallengesParams = {
  userId: string
  status: string
  difficulty: string
  title: string
  categoriesIds: string[]
}

export interface IChallengingService {
  fetchChallengeBySlug(challengeId: string): Promise<ApiResponse<ChallengeDto>>
  fetchChallengeSlugByStarId(starId: string): Promise<ApiResponse<string>>
  fetchChallengesWithOnlyDifficulty(): Promise<
    ApiResponse<{ id: string; difficulty: string }[]>
  >
  fetchDocs(): Promise<ApiResponse<DocDto[]>>
  saveUnlockedDoc(docId: string, userId: string): Promise<ApiResponse<true>>
  // getFilteredChallenges(params: GetFilteredChallengesParams): Promise<Challenge[]>
  // getChallengeSlugByStarId(starId: string): Promise<string>
  // getUserCompletedChallengesIds(userId: string): Promise<string[]>
  // getUserVote(userId: string, challengeId: string): Promise<Vote>
  // checkChallengeCompletition(
  //   challengeId: string,
  //   userId: string
  // ): Promise<boolean>
  // addVotedChallenge(
  //   challengeId: string,
  //   userId: string,
  //   vote: Vote
  // ): Promise<void>
  // updateVotedChallenge(
  //   challengeId: string,
  //   userId: string,
  //   vote: Vote
  // ): Promise<void>
  // removeVotedChallenge(
  //   challengeId: string,
  //   userId: string,
  //   vote: Vote
  // ): Promise<void>
  // addCompletedChallenge(challengeId: string, userId: string): Promise<void>
}
