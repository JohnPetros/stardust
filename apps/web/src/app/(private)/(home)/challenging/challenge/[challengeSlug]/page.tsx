import { notFound } from 'next/navigation'

import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseChallengingService } from '@/api/supabase/services'
import { ChallengePage } from '@/ui/challenging/widgets/pages/Challenge'

type PageProps = {
  params: { challengeSlug: string }
}

export default async function Page({ params: { challengeSlug } }: PageProps) {
  const supabase = SupabaseServerClient()
  const challengesService = SupabaseChallengingService(supabase)
  const challengeResponse = await challengesService.fetchChallengeBySlug(challengeSlug)
  if (challengeResponse.isFailure) return notFound()

  return <ChallengePage challengeDto={challengeResponse.body} />
}
