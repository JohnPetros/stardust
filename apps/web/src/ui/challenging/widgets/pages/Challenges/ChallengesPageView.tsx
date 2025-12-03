import type { ChallengeCategoryDto } from '@stardust/core/challenging/entities/dtos'

import { ChallengesFilters } from './ChallengesFilters'
import { ChallengesList } from './ChallengesList'
import { WarningMessage } from './WarningMessage'
import { PostChallengeLink } from './PostChallengeLink'
import { BackPageLink } from './BackPageLink'

type Props = {
  categoriesDto: ChallengeCategoryDto[]
}

export const ChallengesPageView = ({ categoriesDto }: Props) => {
  return (
    <div className='relative mx-auto pt-6 max-w-2xl px-6 pb-40 md:px-0'>
      <div className='space-y-6'>
        <BackPageLink />
        <WarningMessage />
        <PostChallengeLink />
      </div>
      <div className='mt-6'>
        <ChallengesFilters categoriesDto={categoriesDto} />
        <ChallengesList />
      </div>
    </div>
  )
}
