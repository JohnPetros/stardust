import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseChallengingService } from '@/api/supabase/services'
import type { NextParams } from '@/server/next/types'
import { SolutionPage } from '@/ui/challenging/widgets/pages/Solution'
import { Challenge } from '@stardust/core/challenging/entities'

export default async function Slot({ params }: NextParams<{ challengeSlug: string }>) {
  const supabase = SupabaseServerClient()
  const challengingService = SupabaseChallengingService(supabase)
  const response = await challengingService.fetchChallengeBySlug(params.challengeSlug)
  if (response.isFailure) response.throwError()
  const challenge = Challenge.create(response.body)

  return (
    <SolutionPage
      challengeId={challenge.id}
      challengeSlug={challenge.slug.value}
      savedSolutionDto={null}
    />
  )
}
