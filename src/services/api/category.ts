import type { Category } from '@/types/category'
import { createClient } from '../supabase-browser'

const supabase = createClient()

export default {
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*, challenges_categories(challenge_id)')
      .returns<Category[]>()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },
}
