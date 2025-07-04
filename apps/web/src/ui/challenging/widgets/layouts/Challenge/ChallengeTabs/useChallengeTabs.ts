import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'
import { Integer } from '@stardust/core/global/structures'

import { ROUTES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useChallengeTabs() {
  const { getChallengeSlice, getCraftsVisibilitySlice, getActiveContentSlice } =
    useChallengeStore()
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { activeContent } = getActiveContentSlice()
  const { challenge } = getChallengeSlice()
  const { user, updateUser } = useAuthContext()
  const router = useRouter()
  const toast = useToastContext()

  async function handleShowSolutions() {
    if (!user || !challenge || !craftsVislibility) return

    if (
      user.canAcquire(Integer.create(ChallengeCraftsVisibility.solutionsVisibilityPrice))
        .isFalse
    ) {
      toast.show('Você não possui moedas suficiente')
      return
    }

    user.loseCoins(Integer.create(ChallengeCraftsVisibility.solutionsVisibilityPrice))
    await updateUser(user)
    setCraftsVislibility(craftsVislibility.showSolutions())
    router.goTo(
      ROUTES.challenging.challenges.challengeSolutions.list(challenge.slug.value),
    )
  }

  return {
    activeContent,
    handleShowSolutions,
  }
}
