'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import { Select } from '../../../../../../components/Select'

import { CategoriesFilter } from './CategoriesFilter'
import { Tag } from './Tag'

import type { Category } from '@/@types/category'
import { Search } from '@/app/components/Search'
import type { Difficulty, Status } from '@/contexts/ChallengesListContext'
import { useChallengesList } from '@/hooks/useChallengesList'
import { FILTER_SELECTS_ITEMS } from '@/utils/constants/filter-selects-items'

interface FiltersProps {
  categories: Category[]
}

export function Filters({ categories }: FiltersProps) {
  const { state, dispatch } = useChallengesList()
  const [tags, setTags] = useState<string[]>([])
  const statusTag = useRef<string | null>(null)
  const difficultyTag = useRef<string | null>(null)

  function setCategoriesIds(cateogiresIds: string[]) {
    dispatch({ type: 'setCategoriesIds', payload: cateogiresIds })
  }

  function setStatus(status: Status) {
    dispatch({ type: 'setStatus', payload: status })
  }

  function setDifficulty(difficulty: Difficulty) {
    dispatch({ type: 'setDifficulty', payload: difficulty })
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
      dispatch({ type: 'setSearch', payload: search.trim().toLowerCase() })
    }, 400)
  }

  useEffect(() => {
    state.categoriesIds.forEach((id) => {
      const categoryName = categories.find((category) => category.id === id)
        ?.name

      if (categoryName && !tags.includes(categoryName)) addTag(categoryName)
    })
  }, [state.categoriesIds])

  return (
    <div className="flex flex-col">
      <Search
        placeholder="Pesquisar desafio por título..."
        onSearchChange={handleSearchChange}
        className="bg-gray-800"
      />

      <div className="mt-6 flex items-center gap-6">
        <Select.Container
          onValueChange={(newStatus: string) =>
            handleStatusChange(newStatus as Status)
          }
        >
          <Select.Trigger value="Status" />
          <Select.Content>
            {FILTER_SELECTS_ITEMS.slice(0, 3).map((item, index, allItems) => {
              const isLastItem = index === allItems.length - 1
              return (
                <>
                  <Select.Item
                    value={item.value}
                    icon={item.icon}
                    text={item.text}
                    iconStyles={item.iconStyles}
                  />
                  {!isLastItem && <Select.Separator />}
                </>
              )
            })}
          </Select.Content>
        </Select.Container>

        <Select.Container
          onValueChange={(newDifficulty: string) =>
            handleDifficultyChange(newDifficulty as Difficulty)
          }
        >
          <Select.Trigger value="Dificuldade" />
          <Select.Content>
            {FILTER_SELECTS_ITEMS.slice(3).map((item, index, allItems) => {
              const isLastItem = index === allItems.length - 1
              return (
                <>
                  <Select.Item
                    value={item.value}
                    icon={item.icon}
                    text={item.text}
                    textStyes={item.textStyles}
                    iconStyles={item.iconStyles}
                  />
                  {!isLastItem && <Select.Separator />}
                </>
              )
            })}
          </Select.Content>
        </Select.Container>

        <CategoriesFilter data={categories} />
      </div>

      <div className="mt-6 flex min-h-[48px] flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {tags.map((tag) => {
            const item = FILTER_SELECTS_ITEMS.find((item) => item.text === tag)
            return (
              <Tag
                key={tag}
                name={tag}
                nameStyles={item?.textStyles ?? null}
                icon={item?.icon ?? null}
                iconStyles={item?.iconStyles ?? null}
                onClick={() => handleTagClick(tag, item?.value)}
              />
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
