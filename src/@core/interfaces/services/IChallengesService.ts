import type { ChallengeCategoryDTO, ChallengeDTO } from '@/@core/dtos'
import type { ServiceResponse } from '@/@core/responses'
import type { ChallengesListParams } from '@/@core/types'

export interface IChallengesService {
  fetchChallengeBySlug(challengeId: string): Promise<ServiceResponse<ChallengeDTO>>
  fetchChallengeSlugByStarId(starId: string): Promise<ServiceResponse<string>>
  fetchChallengesWithOnlyDifficulty(): Promise<
    ServiceResponse<{ id: string; difficulty: string }[]>
  >
  fetchChallengesList(
    params: ChallengesListParams,
  ): Promise<ServiceResponse<ChallengeDTO[]>>
  fetchCategories(): Promise<ServiceResponse<ChallengeCategoryDTO[]>>
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
