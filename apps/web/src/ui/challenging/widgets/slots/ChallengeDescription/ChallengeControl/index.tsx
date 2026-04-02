import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useChallengeDescriptionActions } from '../useChallengeDescriptionActions'
import { ChallengeControlView } from './ChallengeControlView'
import { useChallengeControl } from './useChallengeControl'

type Props = {
  isChallengePublic: boolean
  isManagingAsAdmin: boolean
}

export const ChallengeControl = ({ isChallengePublic, isManagingAsAdmin }: Props) => {
  const { challengingService } = useRestContext()
  const { updateChallengeVisibility: onUpdateChallengeVisibility } =
    useChallengeDescriptionActions()
  const {
    challenge,
    isPublic,
    isManagingAsAdminContext,
    handleDeleteChallengeButtonClick,
    handleIsChallengePublicSwitchChange,
  } = useChallengeControl(
    challengingService,
    onUpdateChallengeVisibility,
    isChallengePublic,
    isManagingAsAdmin,
  )

  if (challenge)
    return (
      <ChallengeControlView
        isChallengePublic={isPublic}
        isManagingAsAdmin={isManagingAsAdminContext}
        challengeSlug={challenge.slug.value}
        onDeleteChallengeButtonClick={handleDeleteChallengeButtonClick}
        onIsChallengePublicSwitchChange={handleIsChallengePublicSwitchChange}
      />
    )
}
