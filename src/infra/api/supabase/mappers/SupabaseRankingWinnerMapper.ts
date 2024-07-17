import type { RankingWinnerDTO } from '@/@core/dtos'

import type { SupabaseRankingWinner } from '../types'

export const SupabaseRankingWinnerMapper = () => {
  return {
    toDTO(supabaseRankingWinner: SupabaseRankingWinner): RankingWinnerDTO {
      const rankingWinnerDTO: RankingWinnerDTO = {
        id: supabaseRankingWinner.id ?? '',
        name: supabaseRankingWinner.name ?? '',
        xp: supabaseRankingWinner.xp ?? 0,
        position: supabaseRankingWinner.position,
        avatarImage: supabaseRankingWinner.avatars?.image ?? '',
      }

      return rankingWinnerDTO
    },
  }
}
