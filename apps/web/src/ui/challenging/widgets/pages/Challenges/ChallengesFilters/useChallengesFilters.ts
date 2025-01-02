'use client'

import { useEffect, useRef, useState } from 'react'

import { QUERY_PARAMS } from '../Challenges/query-params'

import { FILTER_SELECTS_ITEMS } from '../filter-select-items'
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
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useQueryArrayParam } from '@/ui/global/hooks/useQueryArrayParam'

export function useChallengesFilter(categories: ChallengeCategory[]) {
  const [tags, setTags] = useState<List<string>>(List.create([]))
  const [difficultyLevel, setDifficultyLevel] = useQueryStringParam(
    QUERY_PARAMS.difficultyLevel,
    'all',
  )
  const [completionStatus, setCompletionStatus] = useQueryStringParam(
    QUERY_PARAMS.completionStatus,
    'all',
  )
  const [title, setTitle] = useQueryStringParam(QUERY_PARAMS.title, 'all')
  const [categoriesIds, setCategoriesIds] = useQueryArrayParam(QUERY_PARAMS.categoriesIds)
  const completionStatusTag = useRef<string | null>(null)
  const difficultyLevelTag = useRef<string | null>(null)
  const includedCategoriesNames = useRef<List<string>>(List.create([]))
  const removedCategoriesNames = useRef<List<string>>(List.create([]))

  // function getCategoriesIds() {
  //   const ceategoriesSearchParam = queryParams.get(QUERY_PARAMS.categoriesIds)

  //   if (ceategoriesSearchParam) {
  //     const categoriesIds = ceategoriesSearchParam.split(',').filter(Boolean)
  //     return categoriesIds
  //   }

  //   return null
  // }

  // function setCategoriesIds(categoriesIds: string[]) {
  //   queryParams.set(QUERY_PARAMS.categoriesIds, categoriesIds.join(','))
  // }

  function removeCategory(categoryName: string) {
    const category = categories.find((category) => category.name.value === categoryName)

    if (category) {
      // const categoriesIds = getCategoriesIds()

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

  function getTag(value: ChallengeCompletionStatus | ChallengeDifficultyLevel) {
    return FILTER_SELECTS_ITEMS.find((item) => item.value === value)?.text
  }

  function handleTagClick(tagText: string, tagValue: string) {
    if (tagValue === 'category') {
      removeCategory(tagText)
      setTags(tags.remove(tagText))
      return
    }

    if (['completed', 'not-completed'].includes(tagValue)) {
      setCompletionStatus('all')
      completionStatusTag.current = null
      setTags(tags.remove(tagText))
      return
    }

    if (['easy', 'medium', 'hard'].includes(tagValue)) {
      setTags(tags.remove(tagText))
      setDifficultyLevel('all')
      difficultyLevelTag.current = null
      return
    }
  }

  function handleStatusChange(newCompletionStatus: ChallengeCompletionStatus) {
    if (!ChallengeCompletion.isStatus(newCompletionStatus)) return

    const tag = getTag(newCompletionStatus)
    if (!tag) return

    let currentTags = tags
    if (completionStatusTag.current) {
      currentTags = currentTags.remove(completionStatusTag.current)
    }
    if (tag !== 'Todos') {
      currentTags = currentTags.add(tag)
    }

    setCompletionStatus(newCompletionStatus)
    setTags(currentTags)
    completionStatusTag.current = tag
  }

  function handleDifficultyChange(newDifficulty: ChallengeDifficultyLevel) {
    if (!ChallengeDifficulty.isDifficultyLevel(newDifficulty)) return

    const tag = getTag(newDifficulty)
    if (!tag) return

    let currentTags = tags
    if (difficultyLevelTag.current) {
      currentTags = currentTags.remove(difficultyLevelTag.current)
    }
    if (tag !== 'Todos') {
      currentTags = currentTags.add(tag)
    }

    setDifficultyLevel(newDifficulty)
    setTags(currentTags)
    difficultyLevelTag.current = tag
  }

  function handleTitleChange(title: string) {
    setTitle(title.trim().toLowerCase())
  }

  useEffect(() => {
    if (difficultyLevel)
      handleDifficultyChange(difficultyLevel as ChallengeDifficultyLevel)
    if (completionStatus)
      handleStatusChange(completionStatus as ChallengeCompletionStatus)
    if (title) handleTitleChange(title)
  }, [])

  useEffect(() => {
    categoriesIds.filter(Boolean).forEach((id) => {
      const categoryName = categories.find((category) => category.id === id)?.name

      if (
        categoryName &&
        includedCategoriesNames.current.includes(categoryName.value).isFalse &&
        removedCategoriesNames.current.includes(categoryName.value).isFalse
      ) {
        includedCategoriesNames.current = includedCategoriesNames.current.add(
          categoryName.value,
        )
        if (categoryName) setTags(tags.add(categoryName.value))
      }
    })

    removedCategoriesNames.current = removedCategoriesNames.current.makeEmpty()
  }, [categoriesIds])

  return {
    tags,
    difficultyLevel,
    handleStatusChange,
    handleDifficultyChange,
    handleTitleChange,
    handleTagClick,
  }
}
