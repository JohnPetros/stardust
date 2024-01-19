'use client'
import { useEffect, useRef, useState } from 'react'

import type { Category } from '@/@types/category'
import {
  Difficulty,
  Status,
  useChallengesListStore,
} from '@/stores/challengesListStore'
import { FILTER_SELECTS_ITEMS } from '@/utils/constants/filter-selects-items'

export function useFilters(categories: Category[]) {
  const { state, actions } = useChallengesListStore()
  const [tags, setTags] = useState<string[]>([])
  const statusTag = useRef<string | null>(null)
  const difficultyTag = useRef<string | null>(null)

  function setCategoriesIds(cateogiresIds: string[]) {
    actions.setCategoriesIds(cateogiresIds)
  }

  function setStatus(status: Status) {
    actions.setStatus(status)
  }

  function setDifficulty(difficulty: Difficulty) {
    actions.setDifficulty(difficulty)
  }

  function removeCategory(categoryName: string) {
    const category = categories.find(
      (category) => category.name === categoryName
    )
    if (category) {
      const categoriesIds = state.categoriesIds.filter(
        (id) => id !== category.id
      )

      setCategoriesIds(categoriesIds)
    }
  }

  function addTag(newTag: string) {
    setTags((currentTags) => [...currentTags, newTag])
  }

  function removeTag(removedTag: string) {
    setTags((currentTags) => currentTags.filter((tag) => tag !== removedTag))
  }

  function getTag(value: Status | Difficulty) {
    return FILTER_SELECTS_ITEMS.find((item) => item.value === value)?.text
  }

  function handleTagClick(tagText: string, tagValue: string | undefined) {
    if (!tagValue) {
      removeTag(tagText)
      removeCategory(tagText)
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

  function handleSearchChange(search: string) {
    setTimeout(() => {
      actions.setSearch(search.trim().toLowerCase())
    }, 400)
  }

  useEffect(() => {
    state.categoriesIds.forEach((id) => {
      const categoryName = categories.find((category) => category.id === id)
        ?.name

      if (categoryName && !tags.includes(categoryName)) addTag(categoryName)
    })
  }, [state.categoriesIds, categories])

  return {
    handleDifficultyChange,
    handleSearchChange,
    handleTagClick,
    handleStatusChange,
  }
}
