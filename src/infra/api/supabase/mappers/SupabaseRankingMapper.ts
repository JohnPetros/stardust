import type { RankingDTO } from '@/@core/dtos'
import type { SupabaseRanking } from '../types'
import type { Ranking } from '@/@core/domain/entities'

export const SupabaseRankingMapper = () => {
  return {
    toRanking(supabaseRanking: SupabaseRanking): RankingDTO {
      const rankingDTO: RankingDTO = {
        id: supabaseRanking.id,
        name: supabaseRanking.name,
        image: supabaseRanking.image,
        position: supabaseRanking.position,
        reward: supabaseRanking.reward,
      }

      return rankingDTO
    },

    toSupabase(ranking: Ranking): SupabaseRanking {
      const rankingDTO = ranking.dto

      const supabaseRanking: SupabaseRanking = {
        id: ranking.id,
        reward: rankingDTO.reward,
        name: rankingDTO.name,
        image: rankingDTO.image,
        position: rankingDTO.position,
      }

      return supabaseRanking
    },
  }
}
