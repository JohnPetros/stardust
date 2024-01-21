import { queries } from '@testing-library/react'

import type { Challenge } from '@/@types/challenge'
import { Vote } from '@/@types/vote'

export type GetFilteredChallengesParams = {
  userId: string
  status: string
  difficulty: string
  categoriesIds: string[]
  search: string
  range: number
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
  addCompletedChallenge(challengeId: string, userId: string): Promise<void>
}
