import { useAction } from 'next-safe-action/hooks'

import { challengingActions } from '@/server/next-safe-action/challengingActions'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { AppError } from '@stardust/core/global/errors'
import { useCallback } from 'react'

export function useCountCompletedChallengesByDifficultyLevelAction() {
  const toast = useToastContext()
  const { executeAsync } = useAction(
    challengingActions.countCompletedChallengesByDifficultyLevel,
    {
      onError: ({ error }) => toast.show(String(error.serverError)),
    },
  )

  const countCompletedChallengesByDifficultyLevel = useCallback(async () => {
    const result = await executeAsync()
    if (!result?.data) throw new AppError('Erro ao gerar gráfico de conquistas')
    return result.data
  }, [executeAsync])

  return {
    countCompletedChallengesByDifficultyLevel,
  }
}
