'use client'
import { useEffect, useState } from 'react'

import { SEARCH_PARAMS } from '../../../constants/search-params'

import type { Category } from '@/@types/Category'
import { filterItemBySearch } from '@/global/helpers'
import { useUrlSearchParams } from '@/global/hooks/useUrlSearchParams'

export function useCategoriesFilter(initialCategories: Category[]) {
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')

  const urlSearchParams = useUrlSearchParams()
  const categoriesIds =
    urlSearchParams
      .get(SEARCH_PARAMS.categoriesIds)
      ?.split(',')
      .filter(Boolean) ?? []

  function handleCategoryClick(categoryId: string, isActive: boolean) {
    let currentCategoriesIds = categoriesIds

    console.log({ currentCategoriesIds })

    if (isActive) {
      currentCategoriesIds = currentCategoriesIds.filter(
        (id) => id !== categoryId
      )
    } else {
      currentCategoriesIds = [...currentCategoriesIds, categoryId]
    }

    urlSearchParams.set(
      SEARCH_PARAMS.categoriesIds,
      currentCategoriesIds.join(',')
    )
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
    categoriesIds: categoriesIds,
    handleCategoryClick,
    handleSearchChange,
  }
}
