'use client'

import { ChallengesList } from './Challenges'
import { ChallengesFilters } from './ChallengesFilters'
import type { ChallengeCategoryDto } from '@stardust/core/challenging/dtos'
import { ChallengeCategory } from '@stardust/core/challenging/entities'

type ChallengesPageProps = {
  categoriesDto: ChallengeCategoryDto[]
}

export function ChallengesPage({ categoriesDto }: ChallengesPageProps) {
  const categories = categoriesDto.map(ChallengeCategory.create)

  return (
    <div className='mx-auto mt-10 max-w-2xl px-6 pb-40 md:px-0'>
      <ChallengesFilters categories={categories} />
      <ChallengesList />
    </div>
  )
}
