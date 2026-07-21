'use client'

import { ROUTES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { ChallengeCodeExecutionsSlotView } from './ChallengeCodeExecutionsSlotView'
import { useChallengeCodeExecutionsSlot } from './useChallengeCodeExecutionsSlot'

export const ChallengeCodeExecutionsSlot = () => {
  const { challengingService } = useRestContext()
  const { isAccountAuthenticated } = useAuthContext()
  const { challenge } = useChallengeStore().getChallengeSlice()
  const {
    executions,
    selectedCodeExecution,
    selectedErrorExecution,
    page,
    itemsPerPage,
    totalItemsCount,
    isLoading,
    isFailure,
    canAccessExecutions,
    handleRetry,
    handlePageChange,
    handleSelectCodeExecution,
    handleSelectErrorExecution,
    handleUseExecutionCode,
  } = useChallengeCodeExecutionsSlot({
    challengingService,
    challengeId: challenge?.id.value ?? null,
    isAccountAuthenticated,
  })

  return (
    <ChallengeCodeExecutionsSlotView
      executions={executions}
      selectedCodeExecution={selectedCodeExecution}
      selectedErrorExecution={selectedErrorExecution}
      page={page}
      itemsPerPage={itemsPerPage}
      totalItemsCount={totalItemsCount}
      isLoading={isLoading}
      isFailure={isFailure}
      isAccountAuthenticated={canAccessExecutions}
      nextRoute={
        challenge
          ? ROUTES.challenging.challenges.challengeExecutions(challenge.slug.value)
          : ROUTES.challenging.challenges.list
      }
      onRetry={handleRetry}
      onPageChange={handlePageChange}
      onSelectCodeExecution={handleSelectCodeExecution}
      onSelectErrorExecution={handleSelectErrorExecution}
      onUseExecutionCode={handleUseExecutionCode}
    />
  )
}
