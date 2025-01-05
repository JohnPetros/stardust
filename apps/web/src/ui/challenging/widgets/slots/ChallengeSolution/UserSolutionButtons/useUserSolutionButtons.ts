import { ROUTES } from '@/constants'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useApi } from '@/ui/global/hooks/useApi'
import { useRouter } from '@/ui/global/hooks/useRouter'

export function useUserSolutionButtons(solutionId: string, challengeSlug: string) {
  const api = useApi()
  const router = useRouter()
  const toast = useToastContext()

  async function handleDeleteSolutionButtonClick() {
    const response = await api.deleteSolution(solutionId)
    if (response.isFailure) {
      toast.show(response.errorMessage)
      return
    }

    router.goTo(ROUTES.challenging.challenges.challengeSolutions.list(challengeSlug))
  }

  return {
    handleDeleteSolutionButtonClick,
  }
}
