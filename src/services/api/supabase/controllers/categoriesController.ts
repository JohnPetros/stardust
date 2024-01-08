import type { ICategoriesController } from '../../interfaces/ICategoriesController'

import type { Category } from '@/@types/category'
import type { Supabase } from '@/@types/supabase'

export const CategoriesController = (
  supabase: Supabase
): ICategoriesController => {
  return {
    getCategories: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*, challenges_categories(challenge_id):challengesIds')
        .returns<Category[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
  }
}
