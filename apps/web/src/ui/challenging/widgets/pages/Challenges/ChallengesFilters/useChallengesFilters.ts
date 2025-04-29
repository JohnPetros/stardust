'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { List } from '@stardust/core/global/structures'
import type { ChallengeCategory } from '@stardust/core/challenging/entities'
import type {
  ChallengeCompletionStatus,
  ChallengeDifficultyLevel,
} from '@stardust/core/challenging/types'
import {
  ChallengeCompletion,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structures'

import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useQueryArrayParam } from '@/ui/global/hooks/useQueryArrayParam'
import { FILTER_SELECTS_ITEMS } from '../filter-select-items'
import { QUERY_PARAMS } from '../query-params'

export function useChallengesFilter(categories: ChallengeCategory[]) {
  const [tags, setTags] = useState(List.create<string>([]))
  const [difficultyLevel, setDifficultyLevel] =
    useQueryStringParam<ChallengeDifficultyLevel>(QUERY_PARAMS.difficultyLevel, 'all')
  const [completionStatus, setCompletionStatus] =
    useQueryStringParam<ChallengeCompletionStatus>(QUERY_PARAMS.completionStatus, 'all')
  const [title, setTitle] = useQueryStringParam(QUERY_PARAMS.title, 'all')
  const [categoriesIds, setCategoriesIds] = useQueryArrayParam(QUERY_PARAMS.categoriesIds)
  const includedCategoriesNames = useRef<List<string>>(List.create([]))
  const removedCategoriesNames = useRef<List<string>>(List.create([]))

  function removeCategory(categoryName: string) {
    const category = categories.find((category) => category.name.value === categoryName)
    if (!category || !categoriesIds) return

    const updatedCategoriesIds = categoriesIds.filter((id) => id !== category.id.value)

    includedCategoriesNames.current = includedCategoriesNames.current.remove(
      category.name.value,
    )
    removedCategoriesNames.current = removedCategoriesNames.current.add(
      category.name.value,
    )
    setCategoriesIds(updatedCategoriesIds)
  }

  const getTag = useCallback(
    (
      value: ChallengeCompletionStatus | ChallengeDifficultyLevel,
      filter: 'completionStatus' | 'difficultyLevel',
    ) => {
      return FILTER_SELECTS_ITEMS[filter].find((item) => item.value === value)?.label
    },
    [],
  )

  function handleTagClick(tagLabel: string, tagValue: string) {
    if (tagValue === 'category') {
      removeCategory(tagLabel)
      setTags(tags.remove(tagLabel))
      return
    }

    const completionStatuses = FILTER_SELECTS_ITEMS.completionStatus.map((item) =>
      String(item.value),
    )
    if (completionStatuses.includes(tagValue)) {
      setCompletionStatus('all')
      setTags(tags.remove(tagLabel))
      return
    }

    const difficultyLevels = FILTER_SELECTS_ITEMS.difficultyLevel.map((item) =>
      String(item.value),
    )
    if (difficultyLevels.includes(tagValue)) {
      setDifficultyLevel('all')
      setTags(tags.remove(tagLabel))
      return
    }
  }

  function handleCompletionStatusChange(newCompletionStatus: ChallengeCompletionStatus) {
    setCompletionStatus(newCompletionStatus)
  }

  function addCompletionStatusTag(completionStatus: ChallengeCompletionStatus) {
    if (!ChallengeCompletion.isStatus(completionStatus)) return
    const tag = getTag(completionStatus, 'completionStatus')
    if (!tag || tag === 'Todos') return

    let currentTags = tags

    const possibleCompletionStatusTags = FILTER_SELECTS_ITEMS.completionStatus.map(
      (item) => item.label,
    )
    const currentDifficultyLevelTag = tags.getSome(possibleCompletionStatusTags)
    if (currentDifficultyLevelTag) {
      currentTags = currentTags.remove(currentDifficultyLevelTag)
    }
    currentTags = currentTags.add(tag)

    setTags(currentTags)
  }

  function handleDifficultyLevelChange(newDifficultyLevel: ChallengeDifficultyLevel) {
    setDifficultyLevel(newDifficultyLevel)
  }

  function addDifficultyLevelTag(difficultyLevel: ChallengeDifficultyLevel) {
    if (!ChallengeDifficulty.isDifficultyLevel(difficultyLevel)) return
    const tag = getTag(difficultyLevel, 'difficultyLevel')
    if (!tag || tag === 'Todos') return

    let currentTags = tags

    const possibleDifficultyLevelTags = FILTER_SELECTS_ITEMS.difficultyLevel.map(
      (item) => item.label,
    )
    const currentDifficultyLevelTag = tags.getSome(possibleDifficultyLevelTags)

    if (currentDifficultyLevelTag) {
      currentTags = currentTags.remove(currentDifficultyLevelTag)
    }
    currentTags = currentTags.add(tag)

    setTags(currentTags)
  }

  function handleTitleChange(title: string) {
    setTitle(title.trim().toLowerCase())
  }

  useEffect(() => {
    if (completionStatus) addCompletionStatusTag(completionStatus)
  }, [completionStatus])

  useEffect(() => {
    if (difficultyLevel) addDifficultyLevelTag(difficultyLevel)
  }, [difficultyLevel])

  useEffect(() => {
    categoriesIds.filter(Boolean).forEach((id) => {
      const categoryName = categories.find((category) => category.id.value === id)?.name

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

    removedCategoriesNames.current = removedCategoriesNames.current.becomeEmpty()
  }, [categoriesIds, categories])

  return {
    title,
    tags,
    difficultyLevel,
    handleDifficultyLevelChange,
    handleCompletionStatusChange,
    handleTitleChange,
    handleTagClick,
  }
}
