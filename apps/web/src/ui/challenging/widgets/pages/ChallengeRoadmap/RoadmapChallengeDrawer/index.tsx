'use client'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ClientAnalyticsProvider } from '@stardust/core/analytics/interfaces'
import type { RoadmapNodeDto } from '@stardust/core/challenging/structures/dtos'
import type { RoadmapChallengeDto } from '../types'
import { RoadmapChallengeDrawerView } from './RoadmapChallengeDrawerView'
import { useRoadmapChallengeDrawer } from './useRoadmapChallengeDrawer'

type Props = {
  isOpen: boolean
  node: RoadmapNodeDto | null
  service: ChallengingService
  analytics: ClientAnalyticsProvider
  recommendationId?: string
  revisionKey: string
  onClose: () => void
  onOpenChallenge: (challenge: RoadmapChallengeDto) => void
}

export function RoadmapChallengeDrawer({
  isOpen,
  node,
  service,
  analytics,
  revisionKey,
  recommendationId,
  onClose,
  onOpenChallenge,
}: Props) {
  const state = useRoadmapChallengeDrawer({
    isOpen,
    node,
    service,
    analytics,
    recommendationId,
    revisionKey,
    onClose,
    onOpenChallenge,
  })
  if (!isOpen || !node) return null
  return (
    <RoadmapChallengeDrawerView
      node={node}
      challenges={state.challenges}
      filteredChallenges={state.filteredChallenges}
      isLoading={state.isLoading}
      error={state.error}
      recommendationId={recommendationId}
      drawerRef={state.drawerRef}
      onClose={state.onClose}
      onRetry={state.retry}
      onFiltersChange={state.setFilteredChallenges}
      onOpenChallenge={state.handleChallengeOpen}
    />
  )
}

export type { Props as RoadmapChallengeDrawerProps }
