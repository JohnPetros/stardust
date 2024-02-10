'use server'

import type { Challenge } from '@/@types/Challenge'
import { IChallengesController } from '@/services/api/interfaces/IChallengesController'

type GetChallengeParams = {
  challengeSlug: string
  userId: string
  challengesController: IChallengesController
}

export async function getChallenge({
  userId,
  challengeSlug,
  challengesController,
}: GetChallengeParams): Promise<Challenge> {
  const challenge = await challengesController.getChallengeBySlug(challengeSlug)

  const isCompleted = await challengesController.checkChallengeCompletition(
    challenge.id,
    userId
  )

  return {
    ...challenge,
    isCompleted,
  }
}
