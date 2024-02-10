'use client'
import { useEffect, useState } from 'react'

import type { Category } from '@/@types/Category'
import { useChallengesListStore } from '@/stores/challengesListStore'
import { filterItemBySearch } from '@/utils/helpers'

export function useCategoriesFilter(initialCategories: Category[]) {
  const { state, actions } = useChallengesListStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')

  function handleCategoryClick(categoryId: string, isActive: boolean) {
    let categoriesIds = state.categoriesIds

    if (isActive) {
      categoriesIds = categoriesIds.filter((id) => id !== categoryId)
    } else {
      categoriesIds = [...categoriesIds, categoryId]
    }

    actions.setCategoriesIds(categoriesIds)
  }

  function handleSearchChange(search: string) {
    setSearch(search)
  }

  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  useEffect(() => {
    function filterCategories() {
      if (!search) return initialCategories

      return initialCategories.filter((category) =>
        filterItemBySearch(search, category.name)
      )
    }

    const filteredCategories = filterCategories()
    setCategories(filteredCategories)
  }, [search, initialCategories])

  return {
    categories,
    categoriesIds: state.categoriesIds,
    handleCategoryClick,
    handleSearchChange,
  }
}
