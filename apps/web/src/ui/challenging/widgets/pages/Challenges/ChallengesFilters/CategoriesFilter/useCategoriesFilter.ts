'use client'

import { useRef, useState } from 'react'

import type { ChallengeCategory } from '@stardust/core/challenging/entities'

import { useQueryArrayParam } from '@/ui/global/hooks/useQueryArrayParam'
import { QUERY_PARAMS } from '../../query-params'
import { Text } from '@stardust/core/global/structures'

export function useCategoriesFilter(initialCategories: ChallengeCategory[]) {
  const [categories, setCategories] = useState<ChallengeCategory[]>(initialCategories)
  const [categoriesIds, setCategoriesIds] = useQueryArrayParam(QUERY_PARAMS.categoriesIds)
  const searchRef = useRef<HTMLInputElement>(null)

  function handleCategoryClick(categoryId: string, isActive: boolean) {
    let currentCategoriesIds = categoriesIds

    if (isActive) {
      currentCategoriesIds = currentCategoriesIds.filter((id) => id !== categoryId)
    } else {
      currentCategoriesIds = [...currentCategoriesIds, categoryId]
    }

    setCategoriesIds(currentCategoriesIds)
  }

  function handleSearchChange(search: string) {
    const filteredCategories = !search
      ? initialCategories
      : initialCategories.filter((category) => category.name.isLike(Text.create(search)).isTrue)
    setCategories(filteredCategories)
    searchRef.current?.focus()
  }

  return {
    searchRef,
    categories,
    categoriesIds: categoriesIds,
    handleCategoryClick,
    handleSearchChange,
  }
}
