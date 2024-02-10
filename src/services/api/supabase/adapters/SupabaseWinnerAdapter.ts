import type { SupabaseWinner } from '../types/SupabaseWinner'

import { Winner } from '@/@types/Winner'

export const SupabaseWinnerAdapter = (supabaseWinner: SupabaseWinner) => {
  const winner: Winner = {
    id: supabaseWinner.id,
    name: supabaseWinner.name,
    xp: supabaseWinner.xp,
    avatarId: supabaseWinner.avatar_id,
    position: supabaseWinner.position,
    userId: supabaseWinner.user_id,
    rankingId: supabaseWinner.ranking_id,
  }

  return winner
}
