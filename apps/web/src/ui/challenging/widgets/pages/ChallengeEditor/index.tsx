'use client'

import { Challenge, ChallengeCategory } from '@stardust/core/challenging/entities'
import type {
  ChallengeCategoryDto,
  ChallengeDto,
} from '@stardust/core/challenging/entities/dtos'
import { InsigniaRole } from '@stardust/core/global/structures'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { ChallengeEditorPageView } from './ChallengeEditorPageView'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type Props = {
  challengeDto?: ChallengeDto
  challengeCategoriesDto: ChallengeCategoryDto[]
}

export const ChallengeEditorPage = ({ challengeDto, challengeCategoriesDto }: Props) => {
  const { user } = useAuthContext()
  const { challengingService } = useRestContext()
  const navigationProvider = useNavigationProvider()
  const toastProvider = useToastContext()
  const categories = challengeCategoriesDto.map((categoryDto) =>
    ChallengeCategory.create(categoryDto),
  )

  if (user) {
    const currentChallenge = challengeDto ? Challenge.create(challengeDto) : null
    const isGod = user.hasInsignia(InsigniaRole.createAsGod()).isTrue
    const isEditingThirdPartyChallenge = currentChallenge
      ? currentChallenge.isChallengeAuthor(user.id).isFalse
      : false

    return (
      <ChallengeEditorPageView
        currentChallenge={currentChallenge}
        userId={user.id}
        isEditingAsAdmin={isGod && isEditingThirdPartyChallenge}
        navigationProvider={navigationProvider}
        toastProvider={toastProvider}
        challengeCategories={categories}
        service={challengingService}
      />
    )
  }
}
