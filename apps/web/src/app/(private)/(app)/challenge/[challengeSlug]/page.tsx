import { notFound } from 'next/navigation'

import { SupabaseServerClient } from '@/infra/api/supabase/clients'
import { SupabaseChallengesService } from '@/infra/api/supabase/services'
import { ChallengePage } from '@/ui/app/components/pages/Challenge'

type PageProps = {
  params: { challengeSlug: string }
}

export default async function Page({ params: { challengeSlug } }: PageProps) {
  const supabase = SupabaseServerClient()
  const challengesService = SupabaseChallengesService(supabase)

  const challengeResponse = await challengesService.fetchChallengeBySlug(challengeSlug)
  if (challengeResponse.isFailure) return notFound()

  return <ChallengePage challengeDto={challengeResponse.data} />
}
