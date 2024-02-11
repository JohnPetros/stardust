import type { ICategoriesController } from '../../interfaces/ICategoriesController'
import type { Supabase } from '../types/Supabase'

import type { Category } from '@/@types/Category'

export const SupabaseCategoriesController = (
  supabase: Supabase
): ICategoriesController => {
  return {
    async getCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*, challenges:challenges_categories(id:challenge_id)')

      if (error) {
        throw new Error(error.message)
      }

      const categories: Category[] = data.map((category) => ({
        id: category.id,
        name: category.name,
        challengesIds: category.challenges.map(({ id }) => id),
      }))

      return categories
    },
  }
}
