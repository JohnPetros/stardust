import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { ChallengeNavigationView } from './ChallengeNavigationView'

type Props = {
  previousChallengeSlug: string | null
  nextChallengeSlug: string | null
  onPreviousChallengeClick: () => void
  onNextChallengeClick: () => void
}

export const ChallengeNavigation = ({
  previousChallengeSlug,
  nextChallengeSlug,
  onPreviousChallengeClick,
  onNextChallengeClick,
}: Props) => {
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()

  if (challenge?.isStarChallenge.isFalse)
    return (
      <ChallengeNavigationView
        canNavigateToPrevious={Boolean(previousChallengeSlug)}
        canNavigateToNext={Boolean(nextChallengeSlug)}
        onPreviousChallengeClick={onPreviousChallengeClick}
        onNextChallengeClick={onNextChallengeClick}
      />
    )
}
