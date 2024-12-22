'use server'

import type { UserDto } from '@stardust/core/global/dtos'
import { GetLastWeekRankingWinnersUseCase } from '@stardust/core/ranking/use-cases'
import { SupabaseRankingService } from '@/api/supabase/services'
import { SupabaseServerActionClient } from '@/api/supabase/clients'

export async function _getLastWeekRankingWinners(userDto: UserDto) {
  const supabase = SupabaseServerActionClient()
  const rankingService = SupabaseRankingService(supabase)

  const useCase = new GetLastWeekRankingWinnersUseCase(rankingService)
  return await useCase.do(userDto)
}
