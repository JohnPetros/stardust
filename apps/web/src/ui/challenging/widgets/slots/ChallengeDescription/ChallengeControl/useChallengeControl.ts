import { ROUTES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useApi } from '@/ui/global/hooks/useApi'
import { useRouter } from '@/ui/global/hooks/useRouter'

export function useChallengeControl(challengeId: string) {
  const api = useApi()
  const router = useRouter()
  const toast = useToastContext()
  const { getChallengeSlice } = useChallengeStore()
  const { challenge, setChallenge } = getChallengeSlice()

  async function handleIsChallengePublicSwitchChange(isPublic: boolean) {
    if (!challenge) return

    challenge.isPublic = isPublic
    setChallenge(challenge)

    const response = await api.updateChallenge(challenge)

    if (response.isFailure) {
      challenge.isPublic = !isPublic
      setChallenge(challenge)
      toast.show(response.errorMessage)
    }
  }

  async function handleDeleteChallengeButtonClick() {
    const response = await api.deleteChallenge(challengeId)
    if (response.isFailure) {
      toast.show(response.errorMessage)
      return
    }

    router.goTo(ROUTES.challenging.challenges.list)
  }

  return {
    handleIsChallengePublicSwitchChange,
    handleDeleteChallengeButtonClick,
  }
}
