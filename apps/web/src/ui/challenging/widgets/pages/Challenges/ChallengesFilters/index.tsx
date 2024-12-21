'use client'

import { AnimatePresence } from 'framer-motion'

import { Search } from '@/ui/global/widgets/components/Search'
import type { ChallengeCategory } from '@/@core/domain/entities'

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
  } = useChallengesFilters(categories)

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
          onValueChange={(newStatus: string) => handleStatusChange(newStatus as Status)}
        >
          <Select.Trigger value='Status' />
          <Select.Content>
            {FILTER_SELECTS_ITEMS.slice(0, 3).map((item, index, allItems) => {
              const isLastItem = index === allItems.length - 1
              const Icon = item.icon
              return (
                <>
                  <Select.Item
                    tabIndex={index + 1}
                    value={item.value}
                    className={item.textStyles}
                  >
                    {Icon && <Icon className={item.iconStyles} />}

                    <Select.Text>{item.text}</Select.Text>
                  </Select.Item>
                  {!isLastItem && <Select.Separator />}
                </>
              )
            })}
          </Select.Content>
        </Select.Container>

        <Select.Container
          defaultValue='all'
          onValueChange={(newDifficulty: string) =>
            handleDifficultyChange(newDifficulty as Difficulty)
          }
        >
          <Select.Trigger value='Dificuldade' />
          <Select.Content>
            {FILTER_SELECTS_ITEMS.slice(3).map((item, index, allItems) => {
              const isLastItem = index === allItems.length - 1
              const Icon = item.icon
              return (
                <>
                  <Select.Item
                    tabIndex={index + 1}
                    value={item.value}
                    className={item.textStyles}
                  >
                    {Icon && <Icon className={item.iconStyles} />}
                    <Select.Text>{item.text}</Select.Text>
                  </Select.Item>
                  {!isLastItem && <Select.Separator />}
                </>
              )
            })}
          </Select.Content>
        </Select.Container>

        <CategoriesFilter initialCategories={categories} />
      </div>

      <div className='mt-6 flex min-h-[48px] flex-wrap gap-2'>
        <AnimatePresence mode='popLayout'>
          {tags.map((tag) => {
            const item = FILTER_SELECTS_ITEMS.find((item) => item.text === tag)
            const Icon = item?.icon

            return (
              <Tag.Animation key={tag}>
                <Tag.X onRemove={() => handleTagClick(tag, item?.value)} />
                {Icon && <Icon className={item?.iconStyles} />}
                <Tag.Name className={item?.textStyles}>{tag}</Tag.Name>
              </Tag.Animation>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
