import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseChallengingService } from '@/api/supabase/services'
import type { NextParams } from '@/server/next/types'
import { ChallengeSolutionSlot } from '@/ui/challenging/widgets/slots/ChallengeSolution'

export default async function Slot({
  params,
}: NextParams<{ challengeSlug: string; solutionSlug: string }>) {
  const supabase = SupabaseServerClient()
  const challengingService = SupabaseChallengingService(supabase)
  const response = await challengingService.fetchSolutionBySlug(params.solutionSlug)
  if (response.isFailure) response.throwError()
  const solutionDto = response.body

  return (
    <ChallengeSolutionSlot
      solutionDto={solutionDto}
      challengeSlug={params.challengeSlug}
    />
  )
}
