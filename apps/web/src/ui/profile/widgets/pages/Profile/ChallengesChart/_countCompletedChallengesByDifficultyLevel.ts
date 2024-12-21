'use server'

import type { UserDto } from '#dtos'
import { CountCompletedChallengesByDifficultyLevelUseCase } from '@/@core/use-cases/challenges'
import { SupabaseServerActionClient } from 'SupabaseServerClient'
import { SupabaseChallengesService } from '@/api/supabase/services'

export async function _countCompletedChallengesByDifficultyLevel(userDto: UserDto) {
  const supabase = SupabaseServerActionClient()
  const challengesService = SupabaseChallengesService(supabase)

  const useCase = new CountCompletedChallengesByDifficultyLevelUseCase(challengesService)

  return await useCase.do(userDto)
}
