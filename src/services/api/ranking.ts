import { createClient } from '../supabase-browser'
import type { Ranking } from '@/types/ranking'

const supabase = createClient()

export default {
  getRanking: async (rankingId: string) => {
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .eq('id', rankingId)
      .single<Ranking>()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },
}
