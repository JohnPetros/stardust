'use client'

import { useEffect, useRef, useState } from 'react'

import type { ChallengeCategory } from '@/@core/domain/entities'
import { SEARCH_PARAMS } from '../ChallengesList/search-params'
import type {
  ChallengeCompletionStatus,
  ChallengeDifficultyLevel,
} from '@/@core/domain/types'
import { ChallengeCompletion, ChallengeDifficulty, List } from '@/@core/domain/structs'

import { useUrlSearchParams } from ''@/ui/global/hooks'/useUrlSearchParams'
import { FILTER_SELECTS_ITEMS } from '../filter-select-items'

export function useChallengesFilter(categories: ChallengeCategory[]) {
  const [tags, setTags] = useState<List<string>>(List.create([]))
  const statusTag = useRef<string | null>(null)
  const difficultyTag = useRef<string | null>(null)
  const includedCategoriesNames = useRef<List<string>>(List.create([]))
  const removedCategoriesNames = useRef<List<string>>(List.create([]))
  const urlSearchParams = useUrlSearchParams()

  const difficultyLevel = urlSearchParams.get(SEARCH_PARAMS.difficultyLevel) ?? 'all'
  const status = urlSearchParams.get(SEARCH_PARAMS.status) ?? 'all'
  const title = urlSearchParams.get(SEARCH_PARAMS.title) ?? ''

  function getCategoriesIds() {
    const ceategoriesSearchParam = urlSearchParams.get(SEARCH_PARAMS.categoriesIds)

    if (ceategoriesSearchParam) {
      const categoriesIds = ceategoriesSearchParam.split(',').filter(Boolean)
      return categoriesIds
    }

    return null
  }

  function setCategoriesIds(categoriesIds: string[]) {
    urlSearchParams.set(SEARCH_PARAMS.categoriesIds, categoriesIds.join(','))
  }

  function setStatus(status: ChallengeCompletionStatus | 'all') {
    urlSearchParams.set(SEARCH_PARAMS.status, status)
  }

  function setDifficultyLevel(difficultyLevel: ChallengeDifficultyLevel | 'all') {
    urlSearchParams.set(SEARCH_PARAMS.difficultyLevel, difficultyLevel)
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
    urlSearchParams.set(SEARCH_PARAMS.title, title.trim().toLowerCase())
  }

  useEffect(() => {
    if (difficulty) handleDifficultyChange(difficulty as ChallengeDifficultyLevel)
    if (status) handleStatusChange(status as Status)
    if (title) handleTitleChange(title)
  }, [])

  useEffect(() => {
    const categoriesIds =
      urlSearchParams.get(SEARCH_PARAMS.categoriesIds)?.split(',') ?? []

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
        console.log('added category name', categoryName)
        addTag(categoryName.value)
      }
    })

    removedCategoriesNames.current = removedCategoriesNames.current.makeEmpty()
  }, [urlSearchParams])

  return {
    tags,
    difficultyLevel,
    handleStatusChange,
    handleDifficultyChange,
    handleTitleChange,
    handleTagClick,
  }
}
