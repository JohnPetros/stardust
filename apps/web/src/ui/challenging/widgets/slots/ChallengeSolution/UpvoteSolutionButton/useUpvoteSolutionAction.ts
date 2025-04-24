import { useAction } from 'next-safe-action/hooks'

import { challengingActions } from '@/rpc/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type UseUpvoteSolutionActionProps = {
  onError: VoidFunction
}

export function useUpvoteSolutionAction({ onError }: UseUpvoteSolutionActionProps) {
  const toast = useToastContext()
  const { executeAsync, isPending } = useAction(challengingActions.upvoteSolution, {
    onError: ({ error }) => {
      onError()
      if (error.serverError) toast.show(error.serverError)
    },
  })

  async function upvoteSolution(solutionId: string) {
    if (isPending) return
    const reponse = await executeAsync({ solutionId })
    if (reponse?.data) return reponse?.data
  }

  return {
    upvoteSolution,
    isExecuting: isPending,
  }
}
