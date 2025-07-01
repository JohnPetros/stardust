import type { Id, Slug } from '@stardust/core/global/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'

import { ROUTES } from '@/constants'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useRouter } from '@/ui/global/hooks/useRouter'

type Params = {
  solutionId: Id
  challengeSlug: Slug
  challengingService: ChallengingService
}

export function useUserSolutionButtons({
  solutionId,
  challengeSlug,
  challengingService,
}: Params) {
  const router = useRouter()
  const toast = useToastContext()

  async function handleDeleteSolutionButtonClick() {
    const response = await challengingService.deleteSolution(solutionId)
    if (response.isFailure) {
      toast.show(response.errorMessage)
      return
    }

    router.goTo(
      ROUTES.challenging.challenges.challengeSolutions.list(challengeSlug.value),
    )
  }

  return {
    handleDeleteSolutionButtonClick,
  }
}
