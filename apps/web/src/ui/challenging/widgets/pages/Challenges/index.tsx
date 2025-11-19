import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { ChallengesPageView } from './ChallengesPageView'
import type { ChallengeCategoryDto } from '@stardust/core/challenging/entities/dtos'

type Props = {
  categoriesDto: ChallengeCategoryDto[]
}

export const ChallengesPage = ({ categoriesDto }: Props) => {
  const { user } = useAuthContext()

  return (
    <ChallengesPageView
      categoriesDto={categoriesDto}
      isChallengePostingEnabled={user?.hasEngineerRole.value ?? false}
    />
  )
}
