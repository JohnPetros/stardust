import { Challenge } from '@stardust/core/challenging/entities'

import type { NextParams } from '@/server/next/types'
import { SupabaseServerClient } from '@/rest/supabase/clients'
import { SupabaseChallengingService } from '@/rest/supabase/services'
import { SolutionPage } from '@/ui/challenging/widgets/pages/Solution'

export default async function Slot({ params }: NextParams<{ challengeSlug: string }>) {
  const supabase = SupabaseServerClient()
  const service = SupabaseChallengingService(supabase)
  const response = await service.fetchChallengeBySlug(params.challengeSlug)
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
