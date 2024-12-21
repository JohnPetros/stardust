'use client'

import { ChallengesList } from './ChallengesList'
import { ChallengesFilters } from './ChallengesFilters'
import type { ChallengeCategoryDTO } from '@/@core/dtos'
import { ChallengeCategory } from '@/@core/domain/entities'

type ChallengesPageProps = {
  categoriesDTO: ChallengeCategoryDTO[]
}

export function ChallengesPage({ categoriesDTO }: ChallengesPageProps) {
  const categories = categoriesDTO.map(ChallengeCategory.create)

  return (
    <div className='mx-auto mt-10 max-w-2xl px-6 pb-40 md:px-0'>
      <ChallengesFilters categories={categories} />

      <ChallengesList categories={categories} />
    </div>
  )
}
