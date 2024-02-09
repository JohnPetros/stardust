import { notFound } from 'next/navigation'

import { getChallenge } from './actions/getChallenge'
import { Header } from './components/ChallengeHeader'

import { Challenge } from '@/@types/Challenge'
import { createSupabaseServerClient } from '@/services/api/supabase/clients/serverClient'
import { AuthController } from '@/services/api/supabase/controllers/authController'
import { ERRORS } from '@/utils/constants'

let challenge: Challenge

type ChallengePageProps = {
  params: { challengeSlug: string }
}

export default async function DefaultChallengePage({
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

  return <Header challenge={challenge} />
}
