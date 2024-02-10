'use client'

import { useSolutionsList } from './useSolutionsList'

import { Loading } from '@/global/components/Loading'
import { useChallengeStore } from '@/stores/challengeStore'

export function SolutionsList() {
  const canShowSolutions = useChallengeStore(
    (store) => store.state.canShowComments
  )

  useSolutionsList(canShowSolutions)

  if (!canShowSolutions)
    return (
      <div className="grid h-full place-content-center">
        <Loading />
      </div>
    )
}
