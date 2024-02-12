import type { Challenge } from '@/@types/Challenge'
import type { ChallengeSummary } from '@/@types/ChallengeSummary'
import type { Vote } from '@/@types/Vote'

export type GetFilteredChallengesParams = {
  userId: string
  status: string
  difficulty: string
  title: string
  categoriesIds: string[]
}

export interface IChallengesController {
  getChallengeBySlug(challengeId: string): Promise<Challenge>
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
