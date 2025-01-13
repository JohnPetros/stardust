import { notFound } from 'next/navigation'

import type { NextParams } from '@/server/next/types'
import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseAuthService, SupabaseChallengingService } from '@/api/supabase/services'
import { ChallengeEditorPage } from '@/ui/challenging/widgets/pages/ChallengeEditor'
import { NotChallengeAuthorError } from '@stardust/core/challenging/errors'

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

  if (challengeDto.author.id !== userId) throw new NotChallengeAuthorError()

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
