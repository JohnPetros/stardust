'use client'

import type { ChallengeCategory } from '@stardust/core/challenging/entities'

import * as AnimatedTagging from '@/ui/global/widgets/components/AnimatedTagging'
import { ChallengeField } from '../ChallengeField'
import { useChallengeCategoriesField } from './useChallengeCategoriesField'
import { CategoryTag } from './CategoryTag'
import { twMerge } from 'tailwind-merge'
import { ErrorMessage } from '@/ui/global/widgets/components/ErrorMessage'

type ChallengeCategoriesFieldProps = {
  categories: ChallengeCategory[]
}

export function ChallengeCategoriesField({ categories }: ChallengeCategoriesFieldProps) {
  const {
    selectedCategories,
    errorMessage,
    handleSelecButtonClick,
    handleUnselectCategoryButtonClick,
  } = useChallengeCategoriesField()

  return (
    <ChallengeField
      title='Categorias'
      subtitle='ajudam os usuários a encontrarem o seu desafio mais rápido'
      icon='tag'
      hasError={Boolean(errorMessage)}
    >
      <div>
        <AnimatedTagging.Container
          className={twMerge(
            'flex gap-3 flex-wrap border rounded-md p-6',
            errorMessage ? 'border-red-700' : 'border-gray-500',
          )}
        >
          {selectedCategories.map((selectedCategory) => (
            <AnimatedTagging.Tag key={selectedCategory.id}>
              <CategoryTag
                isActive={true}
                onClick={() =>
                  handleSelecButtonClick(selectedCategory.id, selectedCategory.name)
                }
              >
                {selectedCategory.name}
              </CategoryTag>
            </AnimatedTagging.Tag>
          ))}
        </AnimatedTagging.Container>
        {errorMessage && <ErrorMessage className='mt-1'>{errorMessage}</ErrorMessage>}
      </div>
      <div className='flex gap-3 flex-wrap'>
        {categories.map((category, index) => (
          <AnimatedTagging.Tag key={category.id}>
            <CategoryTag
              key={category.id}
              isActive={false}
              onClick={() => handleUnselectCategoryButtonClick(index)}
            >
              {category.name.value}
            </CategoryTag>
          </AnimatedTagging.Tag>
        ))}
      </div>
    </ChallengeField>
  )
}
