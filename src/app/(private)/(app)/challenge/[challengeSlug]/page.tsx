import { notFound } from 'next/navigation'

import { getChallenge } from './actions/getChallenge'
import { unlockDoc } from './actions/unlockDoc'
import { Header } from './components/ChallengeHeader'

import type { Challenge } from '@/@types/challenge'
import type { Vote } from '@/@types/vote'
import { createSupabaseServerClient } from '@/services/api/supabase/clients/serverClient'
import { AuthController } from '@/services/api/supabase/controllers/authController'
import { ChallengesController } from '@/services/api/supabase/controllers/challengesController'
import { ERRORS } from '@/utils/constants'

let challenge: Challenge
let userVote: Vote

type ChallengePageProps = {
  params: { challengeSlug: string }
}

export default async function ChallengePage({
  params: { challengeSlug },
}: ChallengePageProps) {
  const supabase = createSupabaseServerClient()
  const authController = AuthController(supabase)

  const userId = await authController.getUserId()

  if (!userId) throw new Error(ERRORS.auth.userNotFound)

  try {
    challenge = await getChallenge(challengeSlug, userId)
  } catch (error) {
    console.error(error)
    notFound()
  }

  try {
    const challengesController = ChallengesController(supabase)
    userVote = await challengesController.getUserVote(userId, challenge.id)
  } catch (error) {
    userVote = null
  }

  try {
    await unlockDoc(challenge, userId)
  } catch (error) {
    console.error(error)
    throw new Error(ERRORS.documentation.failedDocUnlocking)
  }

  return <Header challenge={challenge} userVote={userVote} />
}
