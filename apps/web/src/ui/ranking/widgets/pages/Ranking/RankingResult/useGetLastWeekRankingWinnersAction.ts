import { useAction } from 'next-safe-action/hooks'

import { rankingActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useCallback } from 'react'
import { AppError } from '@stardust/core/global/errors'

export function useGetLastWeekRankingWinnersAction() {
  const toast = useToastContext()
  const { executeAsync } = useAction(rankingActions.getLastWeekRankingWinners, {
    onError: ({ error }) => toast.show(String(error.serverError)),
  })

  const getLastWeekRankingWinners = useCallback(async () => {
    const result = await executeAsync()
    if (!result?.data)
      throw new AppError('Erro ao buscar os ganhadores do ranking da semana passada')
    return result.data
  }, [executeAsync])

  return {
    getLastWeekRankingWinners,
  }
}
