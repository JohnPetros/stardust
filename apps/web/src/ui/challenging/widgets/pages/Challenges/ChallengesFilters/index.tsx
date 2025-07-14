'use client'

import type { ChallengeCategoryDto } from '@stardust/core/challenging/entities/dtos'
import { ChallengeCategory } from '@stardust/core/challenging/entities'

import { ChallengesFiltersView } from './ChallengesFiltersView'
import { useChallengesFilter } from './useChallengesFilters'

type Props = {
  categoriesDto: ChallengeCategoryDto[]
}

export const ChallengesFilters = ({ categoriesDto }: Props) => {
  const categories = categoriesDto.map(ChallengeCategory.create)
  const {
    tags,
    handleTitleChange,
    handleCompletionStatusChange,
    handleDifficultyLevelChange,
    handleTagClick,
  } = useChallengesFilter(categories)

  return (
    <ChallengesFiltersView
      categories={categories}
      tags={tags}
      handleTitleChange={handleTitleChange}
      handleCompletionStatusChange={handleCompletionStatusChange}
      handleDifficultyLevelChange={handleDifficultyLevelChange}
      handleTagClick={handleTagClick}
    />
  )
}
