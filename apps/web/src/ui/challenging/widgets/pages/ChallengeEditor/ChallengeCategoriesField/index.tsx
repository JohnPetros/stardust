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
    selectedCategoriesIds,
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
            'flex gap-1 flex-wrap border rounded-md p-6 min-h-24 w-full',
            errorMessage ? 'border-red-700' : 'border-gray-500',
          )}
        >
          {categories.map((category) => {
            const isSelected = selectedCategoriesIds.includes(category.id.value)
            if (isSelected)
              return (
                <AnimatedTagging.Tag key={category.id.value}>
                  <CategoryTag
                    isActive={true}
                    onClick={() => handleUnselectCategoryButtonClick(category.id.value)}
                  >
                    {category.name.value}
                  </CategoryTag>
                </AnimatedTagging.Tag>
              )
          })}
        </AnimatedTagging.Container>
        {errorMessage && <ErrorMessage className='mt-1'>{errorMessage}</ErrorMessage>}
      </div>
      <div className='flex gap-1 flex-wrap mt-6'>
        {categories.map((category) => {
          const isSelected = selectedCategoriesIds.includes(category.id.value)
          if (!isSelected)
            return (
              <AnimatedTagging.Tag key={category.id.value}>
                <CategoryTag
                  key={category.id.value}
                  isActive={false}
                  onClick={() =>
                    handleSelecButtonClick(category.id.value, category.name.value)
                  }
                >
                  {category.name.value}
                </CategoryTag>
              </AnimatedTagging.Tag>
            )
        })}
      </div>
    </ChallengeField>
  )
}
