'use client'

import { useEffect, useRef, useState } from 'react'

import { QUERY_PARAMS } from '../Challenges/query-params'

import { FILTER_SELECTS_ITEMS } from '../filter-select-items'
import { useQueryParams } from '@/ui/global/hooks/useQueryParams'
import type { ChallengeCategory } from '@stardust/core/challenging/entities'
import type {
  ChallengeCompletionStatus,
  ChallengeDifficultyLevel,
} from '@stardust/core/challenging/types'
import { List } from '@stardust/core/global/structs'
import {
  ChallengeCompletion,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structs'

export function useChallengesFilter(categories: ChallengeCategory[]) {
  const [tags, setTags] = useState<List<string>>(List.create([]))
  const statusTag = useRef<string | null>(null)
  const difficultyTag = useRef<string | null>(null)
  const includedCategoriesNames = useRef<List<string>>(List.create([]))
  const removedCategoriesNames = useRef<List<string>>(List.create([]))
  const queryParams = useQueryParams()

  const difficultyLevel = queryParams.get(QUERY_PARAMS.difficultyLevel) ?? 'all'
  const completitionStatus = queryParams.get(QUERY_PARAMS.completitionStatus) ?? 'all'
  const title = queryParams.get(QUERY_PARAMS.title) ?? ''

  function getCategoriesIds() {
    const ceategoriesSearchParam = queryParams.get(QUERY_PARAMS.categoriesIds)

    if (ceategoriesSearchParam) {
      const categoriesIds = ceategoriesSearchParam.split(',').filter(Boolean)
      return categoriesIds
    }

    return null
  }

  function setCategoriesIds(categoriesIds: string[]) {
    queryParams.set(QUERY_PARAMS.categoriesIds, categoriesIds.join(','))
  }

  function setStatus(status: ChallengeCompletionStatus | 'all') {
    queryParams.set(QUERY_PARAMS.completitionStatus, status)
  }

  function setDifficultyLevel(difficultyLevel: ChallengeDifficultyLevel | 'all') {
    queryParams.set(QUERY_PARAMS.difficultyLevel, difficultyLevel)
  }

  function removeCategory(categoryName: string) {
    const category = categories.find((category) => category.name.value === categoryName)

    if (category) {
      const categoriesIds = getCategoriesIds()

      if (!categoriesIds) return

      const updatedCategoriesIds = categoriesIds.filter((id) => id !== category.id)

      includedCategoriesNames.current = includedCategoriesNames.current.remove(
        category.name.value,
      )
      removedCategoriesNames.current = removedCategoriesNames.current.add(
        category.name.value,
      )
      setCategoriesIds(updatedCategoriesIds)
    }
  }

  function addTag(tag: string) {
    setTags(tags.add(tag))
  }

  function removeTag(tag: string) {
    setTags(tags.remove(tag))
  }

  function getTag(value: ChallengeCompletionStatus | ChallengeDifficultyLevel) {
    return FILTER_SELECTS_ITEMS.find((item) => item.value === value)?.text
  }

  function handleTagClick(tagText: string, tagValue: string | undefined) {
    if (!tagValue) {
      removeCategory(tagText)
      removeTag(tagText)
      return
    }

    if (['completed', 'not-completed'].includes(tagValue)) {
      removeTag(tagText)
      setStatus('all')
      statusTag.current = null
      return
    }

    if (['easy', 'medium', 'hard'].includes(tagValue)) {
      removeTag(tagText)
      setDifficultyLevel('all')
      difficultyTag.current = null
      return
    }
  }

  function handleStatusChange(newStatus: ChallengeCompletionStatus) {
    if (!ChallengeCompletion.isStatus(newStatus)) return

    const tag = getTag(newStatus)
    if (!tag) return

    if (statusTag.current) {
      removeTag(statusTag.current)
    }

    setStatus(newStatus)

    if (tag !== 'Todos') {
      addTag(tag)
      statusTag.current = tag
    }
  }

  function handleDifficultyChange(newDifficulty: ChallengeDifficultyLevel) {
    if (!ChallengeDifficulty.isDifficultyLevel(newDifficulty)) return

    const tag = getTag(newDifficulty)
    if (!tag) return

    if (difficultyTag.current) {
      removeTag(difficultyTag.current)
    }

    setDifficultyLevel(newDifficulty)

    if (tag !== 'Todos') {
      addTag(tag)
      difficultyTag.current = tag
    }
  }

  function handleTitleChange(title: string) {
    // setTimeout(() => {
    //   actions.setSearch(search.trim().toLowerCase())
    // }, 400)
    queryParams.set(QUERY_PARAMS.title, title.trim().toLowerCase())
  }

  useEffect(() => {
    if (difficultyLevel)
      handleDifficultyChange(difficultyLevel as ChallengeDifficultyLevel)
    if (completitionStatus)
      handleStatusChange(completitionStatus as ChallengeCompletionStatus)
    if (title) handleTitleChange(title)
  }, [])

  useEffect(() => {
    const categoriesIds = queryParams.get(QUERY_PARAMS.categoriesIds)?.split(',') ?? []

    categoriesIds.filter(Boolean).forEach((id) => {
      const categoryName = categories.find((category) => category.id === id)?.name

      if (
        categoryName &&
        !includedCategoriesNames.current.includes(categoryName.value) &&
        !removedCategoriesNames.current.includes(categoryName.value)
      ) {
        includedCategoriesNames.current = includedCategoriesNames.current.add(
          categoryName.value,
        )
        addTag(categoryName.value)
      }
    })

    removedCategoriesNames.current = removedCategoriesNames.current.makeEmpty()
  }, [queryParams])

  return {
    tags,
    difficultyLevel,
    handleStatusChange,
    handleDifficultyChange,
    handleTitleChange,
    handleTagClick,
  }
}
