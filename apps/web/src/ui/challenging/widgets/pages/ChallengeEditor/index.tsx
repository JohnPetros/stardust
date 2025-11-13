'use client'

import { Challenge, ChallengeCategory } from '@stardust/core/challenging/entities'
import type {
  ChallengeCategoryDto,
  ChallengeDto,
} from '@stardust/core/challenging/entities/dtos'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useRest } from '@/ui/global/hooks/useRest'
import { ChallengeEditorPageView } from './ChallengeEditorPageView'

type Props = {
  challengeDto?: ChallengeDto
  challengeCategoriesDto: ChallengeCategoryDto[]
}

export const ChallengeEditorPage = ({ challengeDto, challengeCategoriesDto }: Props) => {
  const { user } = useAuthContext()
  const { challengingService } = useRest()
  const navigationProvider = useNavigationProvider()
  const categories = challengeCategoriesDto.map((categoryDto) =>
    ChallengeCategory.create(categoryDto),
  )

  if (user)
    return (
      <ChallengeEditorPageView
        currentChallenge={challengeDto ? Challenge.create(challengeDto) : null}
        userId={user.id}
        navigationProvider={navigationProvider}
        challengeCategories={categories}
        service={challengingService}
      />
    )
}
