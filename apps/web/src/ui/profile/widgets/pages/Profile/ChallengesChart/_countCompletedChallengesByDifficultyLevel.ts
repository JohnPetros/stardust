'use server'

import type { UserDto } from '@stardust/core/global/dtos'
import { CountCompletedChallengesByDifficultyLevelUseCase } from '@stardust/core/challenging/use-cases'

import { SupabaseChallengingService } from '@/api/supabase/services'
import { SupabaseServerActionClient } from '@/api/supabase/clients'

export async function _countCompletedChallengesByDifficultyLevel(userDto: UserDto) {
  const supabase = SupabaseServerActionClient()
  const challengesService = SupabaseChallengingService(supabase)

  const useCase = new CountCompletedChallengesByDifficultyLevelUseCase(challengesService)

  return await useCase.do(userDto)
}
