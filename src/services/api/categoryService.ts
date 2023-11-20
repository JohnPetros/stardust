import type { Category } from '@/@types/category'
import type { Supabase } from '@/@types/supabase'

export const CategoryService = (supabase: Supabase) => {
  return {
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
}
