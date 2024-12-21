'use server'

import type { UserDto } from '#dtos'
import { CountCompletedChallengesByDifficultyLevelUseCase } from '@/@core/use-cases/challenges'
import { SupabaseServerActionClient } from '@/infra/api/supabase/clients'
import { SupabaseChallengesService } from '@/infra/api/supabase/services'

export async function _countCompletedChallengesByDifficultyLevel(userDto: UserDto) {
  const supabase = SupabaseServerActionClient()
  const challengesService = SupabaseChallengesService(supabase)

  const useCase = new CountCompletedChallengesByDifficultyLevelUseCase(challengesService)

  return await useCase.do(userDto)
}
