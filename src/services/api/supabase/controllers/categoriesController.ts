import type { ICategoriesController } from '../../interfaces/ICategoriesController'
import type { Supabase } from '../types/supabase'

import type { Category } from '@/@types/category'

export const CategoriesController = (
  supabase: Supabase
): ICategoriesController => {
  return {
    getCategories: async () => {
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
