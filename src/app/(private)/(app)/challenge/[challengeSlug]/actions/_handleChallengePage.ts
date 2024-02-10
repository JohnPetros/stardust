'use server'

import { notFound } from 'next/navigation'

import { getChallenge } from './_getChallenge'
import { unlockDoc } from './_unlockDoc'

import type { Challenge } from '@/@types/Challenge'
import type { Vote } from '@/@types/Vote'
import { IAuthController } from '@/services/api/interfaces/IAuthController'
import { IChallengesController } from '@/services/api/interfaces/IChallengesController'
import { IDocsController } from '@/services/api/interfaces/IDocsController'
import { APP_ERRORS } from '@/global/constants'

let challenge: Challenge
let userVote: Vote

type _HandleChallengePageParams = {
  challengeSlug: string
  authController: IAuthController
  challengesController: IChallengesController
  docsController: IDocsController
}

export async function _handleChallengePage({
  challengeSlug,
  authController,
  challengesController,
  docsController,
}: _HandleChallengePageParams) {
  const userId = await authController.getUserId()

  if (!userId) throw new Error(APP_ERRORS.auth.userNotFound)

  try {
    challenge = await getChallenge({
      challengeSlug,
      userId,
      challengesController,
    })
  } catch (error) {
    console.error(error)
    notFound()
  }

  try {
    userVote = await challengesController.getUserVote(userId, challenge.id)
  } catch (error) {
    userVote = null
  }

  try {
    await unlockDoc({ challenge, userId, docsController })
  } catch (error) {
    console.error(error)
    throw new Error(APP_ERRORS.documentation.failedDocUnlocking)
  }

  return {
    challenge,
    userVote,
  }
}
