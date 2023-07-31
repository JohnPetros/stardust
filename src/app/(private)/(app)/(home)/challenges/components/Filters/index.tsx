'use client'
import { useRef, useState } from 'react'
import { useChallengesList } from '@/hooks/useChallengesList'

import { Select } from '../Select'
import { Tag } from './Tag'

import type { Difficulty, Status } from '@/contexts/ChallengesListContext'
import type { Category } from '@/types/category'

import { FILTER_SELECTS_ITEMS } from '@/utils/constants/filter-selects-items'
import { AnimatePresence } from 'framer-motion'

interface FiltersProps {
  categories: Category[]
}

export function Filters({ categories }: FiltersProps) {
  const { state, dispatch } = useChallengesList()
  const [tags, setTags] = useState<string[]>([])
  const statusTag = useRef<string | null>(null)
  const difficultyTag = useRef<string | null>(null)
  console.log(tags)

  function setStatus(status: Status) {
    dispatch({ type: 'setStatus', payload: status })
  }

  function setDifficulty(difficulty: Difficulty) {
    dispatch({ type: 'setDifficulty', payload: difficulty })
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

  function handleTagClick(tagText: string, tagValue: string) {
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

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-6">
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
      </div>

      <div className="flex flex-wrap gap-2 mt-6 min-h-[48px]">
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
                onClick={() =>
                  item?.value ? handleTagClick(tag, item.value) : null
                }
              />
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
