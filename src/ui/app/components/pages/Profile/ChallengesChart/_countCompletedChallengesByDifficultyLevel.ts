'use server'

import type { UserDTO } from '@/@core/dtos'
import { CountCompletedChallengesByDifficultyLevelUseCase } from '@/@core/use-cases/challenges'
import { SupabaseServerActionClient } from '@/infra/api/supabase/clients'
import { SupabaseChallengesService } from '@/infra/api/supabase/services'

export async function _countCompletedChallengesByDifficultyLevel(userDTO: UserDTO) {
  const supabase = SupabaseServerActionClient()
  const challengesService = SupabaseChallengesService(supabase)

  const useCase = new CountCompletedChallengesByDifficultyLevelUseCase(challengesService)

  return await useCase.do(userDTO)
}
