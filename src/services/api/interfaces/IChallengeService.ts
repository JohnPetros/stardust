import type { Challenge } from '@/@types/challenge'

interface GetFilteredChallengesParams {
  userId: string
  status: string
  difficulty: string
  categoriesIds: string[]
  search: string
}

export interface IChallengeService {
  getChallenge(challengeId: string, userId: string): Promise<Challenge>
  getChallenges(userId: string): Promise<Challenge[]>
  getFilteredChallenges(
    params: GetFilteredChallengesParams
  ): Promise<Challenge[]>
  getChallengeId(starId: string): Promise<string>
  getUserCompletedChallengesIds(userId: string): Promise<string[]>
  addCompletedChallenge(challengeId: string, userId: string): Promise<void>
}
