'use server'

import type { Challenge } from '@/@types/challenge'
import { createSupabaseServerClient } from '@/services/api/supabase/clients/serverClient'
import { ChallengesController } from '@/services/api/supabase/controllers/challengesController'

export async function getChallenge(
  challengeSlug: string,
  userId: string
): Promise<Challenge> {
  const supabase = createSupabaseServerClient()
  const challengesController = ChallengesController(supabase)

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
