import { notFound } from 'next/navigation'

import type { NextParams } from '@/server/next/types'
import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseChallengingService } from '@/api/supabase/services'
import { ChallengeEditorPage } from '@/ui/challenging/widgets/pages/ChallengeEditor'

export default async function Page({ params }: NextParams<{ challengeSlug: string }>) {
  const supabase = SupabaseServerClient()
  const challengingService = SupabaseChallengingService(supabase)
  const challengeResponse = await challengingService.fetchChallengeBySlug(
    params.challengeSlug,
  )
  console.log(challengeResponse.isFailure)
  if (challengeResponse.isFailure) return notFound()
  const challengeDto = challengeResponse.body

  const categoriesResponse = await challengingService.fetchCategories()
  if (categoriesResponse.isFailure) categoriesResponse.throwError()
  const categoriesDto = categoriesResponse.body

  return (
    <ChallengeEditorPage
      challengeDto={challengeDto}
      challengeCategoriesDto={categoriesDto}
    />
  )
}
