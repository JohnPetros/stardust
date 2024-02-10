import type { SupabaseCategory } from '../types/SupabaseCategory'

import type { Category } from '@/@types/Category'

export const SupabaseCategoryAdapter = (supabaseCategory: SupabaseCategory) => {
  const category: Category = {
    id: supabaseCategory.id,
    name: supabaseCategory.name,
  }

  return category
}
