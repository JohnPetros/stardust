import type { SupabaseRanking } from '../types/SupabaseRanking'

import type { Ranking } from '@/@types/Ranking'

export const SupabaseRankingAdapter = (supabaseRanking: SupabaseRanking) => {
  const ranking: Ranking = {
    id: supabaseRanking.id,
    image: supabaseRanking.image,
    name: supabaseRanking.name,
    position: supabaseRanking.position,
    reward: supabaseRanking.reward,
  }

  return ranking
}
