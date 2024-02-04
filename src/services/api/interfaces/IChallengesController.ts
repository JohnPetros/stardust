import type { Challenge } from '@/@types/challenge'
import type { Vote } from '@/@types/vote'

export type GetFilteredChallengesParams = {
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

export interface IChallengesController {
  getChallengeBySlug(challengeId: string): Promise<Challenge>
  getChallenges(userId: string): Promise<Challenge[]>
  getChallengesSummary(userId: string): Promise<ChallengeSummary[]>
  getFilteredChallenges(
    params: GetFilteredChallengesParams
  ): Promise<Challenge[]>
  getChallengeSlugByStarId(starId: string): Promise<string>
  getUserCompletedChallengesIds(userId: string): Promise<string[]>
  getUserVote(userId: string, challengeId: string): Promise<Vote>
  checkChallengeCompletition(
    challengeId: string,
    userId: string
  ): Promise<boolean>
  addVotedChallenge(
    challengeId: string,
    userId: string,
    vote: Vote
  ): Promise<void>
  updateVotedChallenge(
    challengeId: string,
    userId: string,
    vote: Vote
  ): Promise<void>
  removeVotedChallenge(
    challengeId: string,
    userId: string,
    vote: Vote
  ): Promise<void>
  addCompletedChallenge(challengeId: string, userId: string): Promise<void>
}
