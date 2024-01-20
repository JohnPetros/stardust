import { notFound } from 'next/navigation'

import { getChallenge } from './actions/getChallenge'
import { Header } from './components/Header'

import { Challenge } from '@/@types/challenge'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { AuthController } from '@/services/api/supabase/controllers/authController'
import { ERRORS } from '@/utils/constants'

let challenge: Challenge

type ChallengePageProps = {
  params: { challengeSlug: string }
}

export default async function ChallengePage({
  params: { challengeSlug },
}: ChallengePageProps) {
  const supabase = createServerClient()
  const authController = AuthController(supabase)

  const userId = await authController.getUserId()

  if (!userId) throw new Error(ERRORS.userNotFound)

  try {
    challenge = await getChallenge(challengeSlug, userId)
  } catch (error) {
    console.error(error)
    notFound()
  }

  return <Header challenge={challenge} />
}
