import { useAction } from 'next-safe-action/hooks'

import { forumActions } from '@/rpc/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type UseUpvoteCommentActionProps = {
  onError: VoidFunction
}

export function useUpvoteCommentAction({ onError }: UseUpvoteCommentActionProps) {
  const toast = useToastContext()
  const { executeAsync, isPending } = useAction(forumActions.upvoteComment, {
    onError: ({ error }) => {
      onError()
      if (error.serverError) toast.show(error.serverError)
    },
  })

  async function upvoteComment(commentId: string) {
    if (isPending) return
    const reponse = await executeAsync({ commentId })
    if (reponse?.data) return reponse?.data
  }

  return {
    upvoteComment,
    isExecuting: isPending,
  }
}
