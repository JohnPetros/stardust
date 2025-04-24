import { notFound } from 'next/navigation'

import type { NextParams } from '@/rpc/next/types'
import { SupabaseServerClient } from '@/rest/supabase/clients'
import { SupabaseAuthService, SupabaseChallengingService } from '@/rest/supabase/services'
import { ChallengeEditorPage } from '@/ui/challenging/widgets/pages/ChallengeEditor'

export default async function Page({ params }: NextParams<{ challengeSlug: string }>) {
  const supabase = SupabaseServerClient()
  const challengingService = SupabaseChallengingService(supabase)
  const challengeResponse = await challengingService.fetchChallengeBySlug(
    params.challengeSlug,
  )
  if (challengeResponse.isFailure) return notFound()
  const challengeDto = challengeResponse.body

  const authService = SupabaseAuthService(supabase)
  const authResponse = await authService.fetchUserId()
  const userId = authResponse.body
  if (challengeDto.author.id !== userId) notFound()

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
