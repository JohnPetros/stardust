import type { Challenge } from '@/@types/challenge'

interface GetFilteredChallengesParams {
  userId: string
  status: string
  difficulty: string
  categoriesIds: string[]
  search: string
}

export type ChallengeSummary = Pick<
  Challenge,
  'id' | 'difficulty' | 'isCompleted'
> & {
  users_completed_challenges: []
}

export interface IChallengeService {
  getChallenge(challengeId: string, userId: string): Promise<Challenge>
  getChallenges(userId: string): Promise<Challenge[]>
  getChallengesSummary(userId: string): Promise<ChallengeSummary[]>
  getFilteredChallenges(
    params: GetFilteredChallengesParams
  ): Promise<Challenge[]>
  getChallengeSlugByStarId(starId: string): Promise<string>
  getUserCompletedChallengesIds(userId: string): Promise<string[]>
  addCompletedChallenge(challengeId: string, userId: string): Promise<void>
}
