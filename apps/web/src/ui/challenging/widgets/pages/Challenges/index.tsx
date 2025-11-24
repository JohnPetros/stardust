import type { ChallengeCategoryDto } from '@stardust/core/challenging/entities/dtos'

import { ChallengesPageView } from './ChallengesPageView'

type Props = {
  categoriesDto: ChallengeCategoryDto[]
}

export const ChallengesPage = ({ categoriesDto }: Props) => {
  return <ChallengesPageView categoriesDto={categoriesDto} />
}
