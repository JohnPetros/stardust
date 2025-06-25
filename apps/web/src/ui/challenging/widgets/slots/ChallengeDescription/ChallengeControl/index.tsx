import { useRest } from '@/ui/global/hooks/useRest'
import { ChallengeControlView } from './ChallengeControlView'
import { useChallengeControl } from './useChallengeControl'

type Props = {
  isChallengePublic: boolean
}

export const ChallengeControl = ({ isChallengePublic }: Props) => {
  const { challengingService } = useRest()
  const {
    challenge,
    isPublic,
    handleDeleteChallengeButtonClick,
    handleIsChallengePublicSwitchChange,
  } = useChallengeControl(challengingService, isChallengePublic)

  if (challenge)
    return (
      <ChallengeControlView
        isChallengePublic={isPublic}
        challengeSlug={challenge.slug.value}
        onDeleteChallengeButtonClick={handleDeleteChallengeButtonClick}
        onIsChallengePublicSwitchChange={handleIsChallengePublicSwitchChange}
      />
    )
}
