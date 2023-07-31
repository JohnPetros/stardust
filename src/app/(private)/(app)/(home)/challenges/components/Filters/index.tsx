'use client'
import { useRef, useState } from 'react'
import { useChallengesList } from '@/hooks/useChallengesList'

import { Select } from '../Select'
import { Tag } from './Tag'
import { CheckCircle, Circle, Icon, Minus } from '@phosphor-icons/react'

import type { Difficulty, Status } from '@/contexts/ChallengesListContext'
import { FILTER_SELECTS_ITEMS } from '@/utils/constants/filter-selects-items'
import { AnimatePresence } from 'framer-motion'

export function Filters() {
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
      statusTag.current = 'all'
      return
    }

    if (['easy', 'medium', 'hard'].includes(tagValue)) {
      removeTag(tagText)
      difficultyTag.current = 'all'
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

    if (tag !== 'todos') {
      addTag(tag)
      statusTag.current = tag
    }
  }

  function handleDifficultyChange(newDifficulty: Difficulty) {
    setDifficulty(newDifficulty)
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
            <Select.Item value="easy" text="Fácil" textStye="text-green-500" />
            <Select.Separator />
            <Select.Item
              value="medium"
              text="Médio"
              textStye="text-yellow-400"
            />
            <Select.Separator />
            <Select.Item value="hard" text="Difícil" textStye="text-red-700" />
          </Select.Content>
        </Select.Container>
      </div>

      <div className="flex flex-wrap mt-6">
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
