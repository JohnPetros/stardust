'use client'
import type { Category } from '@/@types/category'
import { useSupabase } from '@/hooks/useSupabase'

export const CategoryService = () => {
  const { supabase } = useSupabase()

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
