'use client'

import type {
  ChallengeCompletionStatus,
  ChallengeDifficultyLevel,
} from '@stardust/core/challenging/types'
import { ChallengeCategory } from '@stardust/core/challenging/entities'
import type { ChallengeCategoryDto } from '@stardust/core/challenging/entities/dtos'

import * as Select from '@/ui/global/widgets/components/Select'
import * as AnimatedTagging from '@/ui/global/widgets/components/AnimatedTagging'
import { Search } from '@/ui/global/widgets/components/Search'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { CategoriesFilter } from './CategoriesFilter'
import { FILTER_SELECTS_ITEMS } from '../filter-select-items'
import { useChallengesFilter } from './useChallengesFilters'
import * as Tag from './Tag'

type FiltersProps = {
  categoriesDto: ChallengeCategoryDto[]
}

export function ChallengesFilters({ categoriesDto }: FiltersProps) {
  const categories = categoriesDto.map(ChallengeCategory.create)
  const {
    title,
    tags,
    handleTitleChange,
    handleCompletionStatusChange,
    handleDifficultyLevelChange,
    handleTagClick,
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
            handleCompletionStatusChange(newStatus as ChallengeCompletionStatus)
          }
        >
          <Select.Trigger value='Status' className='h-10' />
          <Select.Content>
            {FILTER_SELECTS_ITEMS.completionStatus.map((item, index, allItems) => {
              const isLastItem = index === allItems.length - 1
              return (
                <div key={String(index + 1)}>
                  <Select.Item value={item.value} className={item.labelStyles}>
                    {item.icon && (
                      <Icon name={item.icon} size={16} className={item.iconStyles} />
                    )}

                    <Select.Text>{item.label}</Select.Text>
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
            handleDifficultyLevelChange(newDifficulty as ChallengeDifficultyLevel)
          }
        >
          <Select.Trigger value='Dificuldade' className='h-10' />
          <Select.Content>
            {FILTER_SELECTS_ITEMS.difficultyLevel.map((item, index, allItems) => {
              const isLastItem = index === allItems.length - 1
              return (
                <div key={String(index + 1)}>
                  <Select.Item value={item.value} className={item.labelStyles}>
                    {item.icon && (
                      <Icon name={item.icon} size={16} className={item.iconStyles} />
                    )}
                    <Select.Text>{item.label}</Select.Text>
                  </Select.Item>
                  {!isLastItem && <Select.Separator />}
                </div>
              )
            })}
          </Select.Content>
        </Select.Container>

        <CategoriesFilter initialCategories={categories} />
      </div>

      <AnimatedTagging.Container className='mt-6 flex min-h-[48px] flex-wrap gap-2'>
        {tags.items.map((tag) => {
          const item = [
            ...FILTER_SELECTS_ITEMS.completionStatus,
            ...FILTER_SELECTS_ITEMS.difficultyLevel,
          ].find((item) => item.label === tag)
          if (item)
            return (
              <AnimatedTagging.Tag key={tag}>
                <Tag.X onRemove={() => handleTagClick(tag, item.value)} />
                {item.icon && (
                  <Icon name={item.icon} size={14} className={item.iconStyles} />
                )}
                <Tag.Name className={item.labelStyles}>{tag}</Tag.Name>
              </AnimatedTagging.Tag>
            )

          return (
            <AnimatedTagging.Tag key={tag}>
              <Tag.X onRemove={() => handleTagClick(tag, 'category')} />
              <Tag.Name className='text-gray-300'>{tag}</Tag.Name>
            </AnimatedTagging.Tag>
          )
        })}
      </AnimatedTagging.Container>
    </div>
  )
}
