'use client'

import { useEffect, useState } from 'react'

import { QUERY_PARAMS } from '../../Challenges/query-params'
import type { ChallengeCategory } from '@stardust/core/challenging/entities'
import { useQueryParams } from '@/ui/global/hooks/useQueryParams'

export function useCategoriesFilter(initialCategories: ChallengeCategory[]) {
  const [categories, setCategories] = useState<ChallengeCategory[]>([])
  const [search, setSearch] = useState('')

  const queryParams = useQueryParams()
  const categoriesIds =
    queryParams.get(QUERY_PARAMS.categoriesIds)?.split(',').filter(Boolean) ?? []

  function handleCategoryClick(categoryId: string, isActive: boolean) {
    let currentCategoriesIds = categoriesIds

    if (isActive) {
      currentCategoriesIds = currentCategoriesIds.filter((id) => id !== categoryId)
    } else {
      currentCategoriesIds = [...currentCategoriesIds, categoryId]
    }

    queryParams.set(QUERY_PARAMS.categoriesIds, currentCategoriesIds.join(','))
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
      return initialCategories.filter((category) => category.name.isLike(search))
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
