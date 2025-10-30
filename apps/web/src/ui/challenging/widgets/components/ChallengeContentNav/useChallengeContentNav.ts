import { ROUTES } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'

export function useChallengeContentNav() {
  const { getChallengeSlice, getCraftsVisibilitySlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { user, updateUser } = useAuthContext()
  const { goTo } = useNavigationProvider()

  async function handleShowSolutions() {
    if (!user || !challenge || !craftsVislibility) return

    user.unlockChallengeSolutions(challenge.id)
    await updateUser(user)
    setCraftsVislibility(craftsVislibility.showSolutions())
    goTo(ROUTES.challenging.challenges.challengeSolutions.list(challenge.slug.value))
  }

  return {
    craftsVislibility,
    handleShowSolutions,
  }
}
