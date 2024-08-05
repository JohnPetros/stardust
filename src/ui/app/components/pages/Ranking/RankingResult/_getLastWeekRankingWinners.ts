'use server'

import type { UserDTO } from '@/@core/dtos'
import { GetLastWeekRankingWinnersUseCase } from '@/@core/use-cases/rankings'
import { SupabaseServerActionClient } from '@/infra/api/supabase/clients'
import { SupabaseRankingsService } from '@/infra/api/supabase/services'

export async function _getLastWeekRankingWinners(userDTO: UserDTO) {
  const supabase = SupabaseServerActionClient()
  const rankingsService = SupabaseRankingsService(supabase)

  const useCase = new GetLastWeekRankingWinnersUseCase(rankingsService)
  return await useCase.do(userDTO)
}
