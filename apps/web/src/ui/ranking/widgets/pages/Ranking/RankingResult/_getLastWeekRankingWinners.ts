'use server'

import type { UserDto } from '@stardust/core/global/dtos'
import { GetLastWeekRankingWinnersUseCase } from '@/@core/use-cases/rankings'
import { SupabaseServerActionClient } from 'SupabaseServerClient'
import { SupabaseRankingsService } from '@/api/supabase/services'

export async function _getLastWeekRankingWinners(userDto: UserDto) {
  const supabase = SupabaseServerActionClient()
  const rankingsService = SupabaseRankingsService(supabase)

  const useCase = new GetLastWeekRankingWinnersUseCase(rankingsService)
  return await useCase.do(userDto)
}
