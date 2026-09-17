'use client'

import { useMemo } from 'react'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useAnalyticsProvider } from '@/provision/analytics/useAnalyticsProvider'
import { STORAGE } from '@/constants'
import { useChallengeRoadmap } from './useChallengeRoadmap'
import { ChallengeRoadmapPageView } from './ChallengeRoadmapPageView'
import type { RoadmapProps } from './types'

export function ChallengeRoadmap({ initialRoadmap, initialError }: RoadmapProps) {
  const { challengingService } = useRestContext()
  const navigation = useNavigationProvider()
  const analytics = useAnalyticsProvider()
  const [node, setNode] = useQueryStringParam('node')
  const storage = useMemo(
    () => ({
      get: () => {
        try {
          const value = sessionStorage.getItem(
            `${STORAGE.keys.challengeRoadmapViewport}:${initialRoadmap?.revision.key ?? 'unknown'}`,
          )
          return value ? JSON.parse(value) : null
        } catch {
          return null
        }
      },
      set: (value: { x: number; y: number; zoom: number }) => {
        try {
          sessionStorage.setItem(
            `${STORAGE.keys.challengeRoadmapViewport}:${initialRoadmap?.revision.key ?? 'unknown'}`,
            JSON.stringify(value),
          )
        } catch {
          /* storage is optional */
        }
      },
    }),
    [initialRoadmap?.revision.key],
  )
  const contextStorage = useLocalStorage<{
    revisionKey: string
    nodeKey: string
    challengeId: string | null
  }>(STORAGE.keys.challengeRoadmapContext)
  const state = useChallengeRoadmap({
    initialRoadmap,
    initialError,
    service: challengingService,
    analytics,
    navigation,
    query: { node, setNode },
    viewportStorage: storage,
    contextStorage,
  })
  return (
    <ChallengeRoadmapPageView
      {...state}
      service={challengingService}
      analytics={analytics}
    />
  )
}
