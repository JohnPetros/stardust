'use client'

import type { ChallengeCategory } from '@stardust/core/challenging/entities'

import * as AnimatedTagging from '@/ui/global/widgets/components/AnimatedTagging'
import { ChallengeField } from '../ChallengeField'
import { useChallengeCategoriesField } from './useChallengeCategoriesField'
import { CategoryTag } from './CategoryTag'

type ChallengeCategoriesFieldProps = {
  categories: ChallengeCategory[]
}

export function ChallengeCategoriesField({ categories }: ChallengeCategoriesFieldProps) {
  const {
    selectedCategories,
    handleSelecButtonClick,
    handleUnselectCategoryButtonClick,
  } = useChallengeCategoriesField()

  return (
    <ChallengeField
      title='Categorias'
      subtitle='ajudam os usuários a encontrarem o seu desafio mais rápido'
      icon='tag'
    >
      <AnimatedTagging.Container className='flex gap-3 flex-wrap border border-gray-500 rounded-md p-6'>
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
