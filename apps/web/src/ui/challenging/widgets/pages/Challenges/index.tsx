'use client'

import Link from 'next/link'

import type { ChallengeCategoryDto } from '@stardust/core/challenging/dtos'
import { ChallengeCategory } from '@stardust/core/challenging/entities'

import { ROUTES } from '@/constants'
import { Button } from '@/ui/global/widgets/components/Button'
import { ChallengesFilters } from './ChallengesFilters'
import { ChallengesList } from './ChallengesList'
import { Icon } from '@/ui/global/widgets/components/Icon'

type ChallengesPageProps = {
  categoriesDto: ChallengeCategoryDto[]
}

export function ChallengesPage({ categoriesDto }: ChallengesPageProps) {
  const categories = categoriesDto.map(ChallengeCategory.create)

  return (
    <div className='mx-auto mt-10 max-w-2xl px-6 pb-40 md:px-0'>
      <Link
        href={ROUTES.challenging.challenge()}
        className='flex items-center w-max text-green-400 px-3 ml-auto text-sm'
      >
        Criar seu próprio desafio para outros usuários
        <Icon name='simple-arrow-right' size={16} />
      </Link>
      <div className='mt-6'>
        <ChallengesFilters categories={categories} />
        <ChallengesList />
      </div>
    </div>
  )
}
