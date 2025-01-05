'use client'

import { AnimatePresence } from 'framer-motion'

import type {
  ChallengeCompletionStatus,
  ChallengeDifficultyLevel,
} from '@stardust/core/challenging/types'
import type { ChallengeCategory } from '@stardust/core/challenging/entities'

import { Search } from '@/ui/global/widgets/components/Search'
import { Select } from '@/ui/global/widgets/components/Select'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { CategoriesFilter } from './CategoriesFilter'
import { FILTER_SELECTS_ITEMS } from '../filter-select-items'
import { useChallengesFilter } from './useChallengesFilters'
import * as Tag from './Tag'

type FiltersProps = {
  categories: ChallengeCategory[]
}

export function ChallengesFilters({ categories }: FiltersProps) {
  const {
    handleTitleChange,
    handleStatusChange,
    handleDifficultyChange,
    handleTagClick,
    tags,
  } = useChallengesFilter(categories)

  return (
    <div className='flex flex-col'>
      <Search
        placeholder='Pesquisar desafio por título...'
        onSearchChange={handleTitleChange}
        className='bg-gray-800'
      />

      <div className='mt-6 flex items-center gap-6'>
        <Select.Container
          defaultValue='all'
          onValueChange={(newStatus: string) =>
            handleStatusChange(newStatus as ChallengeCompletionStatus)
          }
        >
          <Select.Trigger value='Status' />
          <Select.Content>
            {FILTER_SELECTS_ITEMS.slice(0, 3).map((item, index, allItems) => {
              const isLastItem = index === allItems.length - 1
              return (
                <div key={String(index + 1)}>
                  <Select.Item value={item.value} className={item.textStyles}>
                    {item.icon && (
                      <Icon name={item.icon} size={16} className={item.iconStyles} />
                    )}

                    <Select.Text>{item.text}</Select.Text>
                  </Select.Item>
                  {!isLastItem && <Select.Separator />}
                </div>
              )
            })}
          </Select.Content>
        </Select.Container>

        <Select.Container
          defaultValue='all'
          onValueChange={(newDifficulty: string) =>
            handleDifficultyChange(newDifficulty as ChallengeDifficultyLevel)
          }
        >
          <Select.Trigger value='Dificuldade' />
          <Select.Content>
            {FILTER_SELECTS_ITEMS.slice(3).map((item, index, allItems) => {
              const isLastItem = index === allItems.length - 1
              return (
                <div key={String(index + 1)}>
                  <Select.Item value={item.value} className={item.textStyles}>
                    {item.icon && (
                      <Icon name={item.icon} size={16} className={item.iconStyles} />
                    )}
                    <Select.Text>{item.text}</Select.Text>
                  </Select.Item>
                  {!isLastItem && <Select.Separator />}
                </div>
              )
            })}
          </Select.Content>
        </Select.Container>

        <CategoriesFilter initialCategories={categories} />
      </div>

      <div className='mt-6 flex min-h-[48px] flex-wrap gap-2'>
        <AnimatePresence mode='popLayout'>
          {tags.items.map((tag) => {
            const item = FILTER_SELECTS_ITEMS.find((item) => item.text === tag)
            if (item)
              return (
                <Tag.AnimatedContainer key={tag}>
                  <Tag.X onRemove={() => handleTagClick(tag, item.value)} />
                  {item.icon && (
                    <Icon name={item.icon} size={14} className={item.iconStyles} />
                  )}
                  <Tag.Name className={item.textStyles}>{tag}</Tag.Name>
                </Tag.AnimatedContainer>
              )

            return (
              <Tag.AnimatedContainer key={tag}>
                <Tag.X onRemove={() => handleTagClick(tag, 'category')} />
                <Tag.Name className='text-gray-300'>{tag}</Tag.Name>
              </Tag.AnimatedContainer>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
