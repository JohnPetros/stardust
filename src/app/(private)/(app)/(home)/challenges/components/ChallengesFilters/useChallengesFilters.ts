'use client'

import { useEffect, useRef, useState } from 'react'

import { FILTER_SELECTS_ITEMS } from '../../constants/filter-selects-items'
import { SEARCH_PARAMS } from '../../constants/search-params'
import { isDifficulty } from '../../guards/isDifficulty'
import { isStatus } from '../../guards/isStatus'

import type { Category } from '@/@types/Category'
import { useUrlSearchParams } from '@/global/hooks/useUrlSearchParams'
import { Difficulty, Status } from '@/stores/challengesListStore'

export function useChallengesFilters(categories: Category[]) {
  const [tags, setTags] = useState<string[]>([])

  const statusTag = useRef<string | null>(null)
  const difficultyTag = useRef<string | null>(null)

  const includedCategories = useRef<string[]>([])
  const removedCategories = useRef<string[]>([])

  const urlSearchParams = useUrlSearchParams()

  const difficulty = urlSearchParams.get(SEARCH_PARAMS.difficulty) ?? 'all'
  const status = urlSearchParams.get(SEARCH_PARAMS.status) ?? 'all'
  const title = urlSearchParams.get(SEARCH_PARAMS.title) ?? ''

  function getCategoriesIds() {
    const ceategoriesSearchParam = urlSearchParams.get(
      SEARCH_PARAMS.categoriesIds
    )

    if (ceategoriesSearchParam) {
      const categoriesIds = ceategoriesSearchParam.split(',').filter(Boolean)
      return categoriesIds
    }

    return null
  }

  function setCategoriesIds(categoriesIds: string[]) {
    urlSearchParams.set(SEARCH_PARAMS.categoriesIds, categoriesIds.join(','))
  }

  function setStatus(status: Status) {
    urlSearchParams.set(SEARCH_PARAMS.status, status)
  }

  function setDifficulty(difficulty: Difficulty) {
    urlSearchParams.set(SEARCH_PARAMS.difficulty, difficulty)
  }

  function removeCategory(categoryName: string) {
    const category = categories.find(
      (category) => category.name === categoryName
    )

    if (category) {
      const categoriesIds = getCategoriesIds()

      if (!categoriesIds) return

      const updatedCategoriesIds = categoriesIds.filter(
        (id) => id !== category.id
      )

      console.log({ updatedCategoriesIds })
      includedCategories.current = includedCategories.current.filter(
        (includedCategory) => includedCategory !== category.name
      )
      removedCategories.current.push(category.name)
      setCategoriesIds(updatedCategoriesIds)
    }
  }

  function addTag(newTag: string) {
    setTags((currentTags) => {
      return [...currentTags, newTag]
    })
  }

  function removeTag(removedTag: string) {
    setTags((currentTags) => currentTags.filter((tag) => tag !== removedTag))
  }

  function getTag(value: Status | Difficulty) {
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
      setDifficulty('all')
      difficultyTag.current = null
      return
    }
  }

  function handleStatusChange(newStatus: Status) {
    if (!isStatus(newStatus)) return

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

  function handleDifficultyChange(newDifficulty: Difficulty) {
    if (!isDifficulty(newDifficulty)) return

    const tag = getTag(newDifficulty)
    if (!tag) return

    if (difficultyTag.current) {
      removeTag(difficultyTag.current)
    }

    setDifficulty(newDifficulty)

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
    if (difficulty) handleDifficultyChange(difficulty as Difficulty)
    if (status) handleStatusChange(status as Status)
    if (title) handleTitleChange(title)
  }, [])

  useEffect(() => {
    const categoriesIds =
      urlSearchParams.get(SEARCH_PARAMS.categoriesIds)?.split(',') ?? []

    console.log('urlSearchParams', { categoriesIds })

    categoriesIds.filter(Boolean).forEach((id) => {
      const categoryName = categories.find((category) => category.id === id)
        ?.name

      if (
        categoryName &&
        !includedCategories.current.includes(categoryName) &&
        !removedCategories.current.includes(categoryName)
      ) {
        includedCategories.current.push(categoryName)
        console.log('added category name', categoryName)
        addTag(categoryName)
      }
    })

    removedCategories.current = []
  }, [urlSearchParams])

  return {
    tags,
    handleStatusChange,
    handleDifficultyChange,
    handleTitleChange,
    handleTagClick,
  }
}
