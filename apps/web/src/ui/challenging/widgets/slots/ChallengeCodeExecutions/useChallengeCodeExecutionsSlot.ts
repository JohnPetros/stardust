import { useCallback, useEffect, useState } from 'react'

import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Id, OrdinalNumber } from '@stardust/core/global/structures'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'

const ITEMS_PER_PAGE = 20

type Params = {
  challengingService: ChallengingService
  challengeId: string | null
  isAccountAuthenticated: boolean
}

export function useChallengeCodeExecutionsSlot({
  challengingService,
  challengeId,
  isAccountAuthenticated,
}: Params) {
  const [executions, setExecutions] = useState<ChallengeCodeExecution[]>([])
  const [selectedCodeExecution, setSelectedCodeExecution] =
    useState<ChallengeCodeExecution | null>(null)
  const [selectedErrorExecution, setSelectedErrorExecution] =
    useState<ChallengeCodeExecution | null>(null)
  const [page, setPage] = useState(1)
  const [totalItemsCount, setTotalItemsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isFailure, setIsFailure] = useState(false)
  const [isUnauthorized, setIsUnauthorized] = useState(false)
  const { replaceCurrentCodeWithExecution } = useChallengeStore().getCodeExecutionSlice()

  const fetchExecutions = useCallback(
    async (nextPage: number) => {
      if (!challengeId || !isAccountAuthenticated) return

      setIsLoading(true)
      setIsFailure(false)

      const response = await challengingService.fetchChallengeCodeExecutions({
        challengeId: Id.create(challengeId),
        page: OrdinalNumber.create(nextPage),
        itemsPerPage: OrdinalNumber.create(ITEMS_PER_PAGE),
      })

      if (response.isFailure) {
        if (response.statusCode === HTTP_STATUS_CODE.unauthorized) {
          setIsUnauthorized(true)
        } else {
          setIsFailure(true)
        }
        setIsLoading(false)
        return
      }

      setIsUnauthorized(false)
      setExecutions(response.body.items.map(ChallengeCodeExecution.create))
      setTotalItemsCount(response.body.totalItemsCount)
      setPage(response.body.page)
      setIsLoading(false)
    },
    [challengeId, challengingService, isAccountAuthenticated],
  )

  function handlePageChange(nextPage: number) {
    fetchExecutions(nextPage)
  }

  function handleUseExecutionCode(execution: ChallengeCodeExecution) {
    replaceCurrentCodeWithExecution(execution)
    setSelectedCodeExecution(null)
  }

  useEffect(() => {
    if (!isAccountAuthenticated) {
      setExecutions([])
      setTotalItemsCount(0)
      setIsFailure(false)
      setIsLoading(false)
      setIsUnauthorized(false)
      return
    }

    fetchExecutions(1)
  }, [fetchExecutions, isAccountAuthenticated])

  return {
    executions,
    selectedCodeExecution,
    selectedErrorExecution,
    page,
    itemsPerPage: ITEMS_PER_PAGE,
    totalItemsCount,
    isLoading,
    isFailure,
    canAccessExecutions: isAccountAuthenticated && !isUnauthorized,
    handleRetry: () => fetchExecutions(page),
    handlePageChange,
    handleSelectCodeExecution: setSelectedCodeExecution,
    handleSelectErrorExecution: setSelectedErrorExecution,
    handleUseExecutionCode,
  }
}
