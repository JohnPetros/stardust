import Link from 'next/link'

import type { ChallengeCategoryDto } from '@stardust/core/challenging/dtos'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { ChallengesFilters } from './ChallengesFilters'
import { ChallengesList } from './ChallengesList'
import { WarningMessage } from './WarningMessage'

type ChallengesPageProps = {
  categoriesDto: ChallengeCategoryDto[]
}

export function ChallengesPage({ categoriesDto }: ChallengesPageProps) {
  return (
    <div className='mx-auto mt-10 max-w-2xl px-6 pb-40 md:px-0'>
      <WarningMessage />
      <Link
        href={ROUTES.challenging.challenge()}
        className='flex items-center w-max text-green-400 px-3 ml-auto mt-3 text-sm'
      >
        Criar seu próprio desafio para outros usuários
        <Icon name='simple-arrow-right' size={16} />
      </Link>
      <div className='mt-6'>
        <ChallengesFilters categoriesDto={categoriesDto} />
        <ChallengesList />
      </div>
    </div>
  )
}
