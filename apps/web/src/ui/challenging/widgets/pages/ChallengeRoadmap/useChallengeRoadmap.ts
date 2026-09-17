'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ClientAnalyticsProvider } from '@stardust/core/analytics/interfaces'
import type { ChallengeRoadmapDto } from '@stardust/core/challenging/structures/dtos'
import type { Edge, Node, Viewport } from '@xyflow/react'
import type { RoadmapCategoryNodeData } from './RoadmapGraph/RoadmapCategoryNode'
import type { RoadmapChallengeDto, RoadmapNodeWithMeta } from './types'
import { ROUTES } from '@/constants'

type Query = { node: string | null; setNode: (value: string | null) => void }
type Storage = { get: () => Viewport | null; set: (value: Viewport) => void }
type RoadmapContextStorage = {
  set: (value: { revisionKey: string; nodeKey: string; challengeId: string | null }) => void
}
type Navigation = { goTo: (route: string) => void }
export type ChallengeRoadmapHookParams = {
  initialRoadmap?: ChallengeRoadmapDto
  initialError?: string
  service: ChallengingService
  analytics: ClientAnalyticsProvider
  navigation: Navigation
  query: Query
  viewportStorage: Storage
  contextStorage: RoadmapContextStorage
}

export function useChallengeRoadmap({
  initialRoadmap,
  initialError,
  service,
  analytics,
  navigation,
  query,
  viewportStorage,
  contextStorage,
}: ChallengeRoadmapHookParams) {
  const [roadmap, setRoadmap] = useState(initialRoadmap ?? null)
  const [error, setError] = useState(initialError ?? null)
  const [isLoading, setIsLoading] = useState(!initialRoadmap && !initialError)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list')
  const viewed = useRef(false)

  const revalidate = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await service.fetchChallengeRoadmap()
      if (response.isFailure) setError(response.errorMessage)
      else {
        setRoadmap(response.body)
        setError(null)
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível atualizar o roadmap.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [service])

  useEffect(() => {
    if (!viewed.current) {
      analytics.trackEvent('challenge_roadmap_viewed')
      viewed.current = true
    }
    const refresh = () => {
      if (document.visibilityState === 'visible') void revalidate()
    }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [analytics, revalidate])

  const nodes = useMemo<RoadmapNodeWithMeta[]>(() => {
    if (!roadmap) return []
    return roadmap.nodes.map((node) => ({
      ...node,
      prerequisiteKeys: roadmap.edges
        .filter((edge) => edge.dependentNodeKey === node.key)
        .map(
          (edge) =>
            roadmap.nodes.find((item) => item.key === edge.prerequisiteNodeKey)?.category
              .name ?? edge.prerequisiteNodeKey,
        ),
    }))
  }, [roadmap])
  const selectedNodeKey = roadmap?.nodes.some((node) => node.key === query.node)
    ? query.node
    : null
  const recommendationNodeKey = roadmap?.recommendation?.nodeKey ?? null
  const selectedNode = roadmap?.nodes.find((node) => node.key === selectedNodeKey) ?? null

  const selectNode = useCallback(
    (key: string) => {
      query.setNode(key)
      analytics.trackEvent('challenge_roadmap_node_opened', { nodeKey: key })
    },
    [analytics, query],
  )

  useEffect(() => {
    if (query.node && roadmap && !roadmap.nodes.some((node) => node.key === query.node))
      query.setNode(null)
  }, [query, roadmap])

  const graphNodes = useMemo<Node<RoadmapCategoryNodeData>[]>(
    () =>
      nodes.map((node) => ({
        id: node.key,
        type: 'category',
        position: node.position,
        data: {
          node,
          isSelected: node.key === selectedNodeKey,
          isRecommended: node.key === recommendationNodeKey,
          onSelect: selectNode,
        },
        draggable: false,
        selectable: true,
      })),
    [nodes, recommendationNodeKey, selectNode, selectedNodeKey],
  )
  const graphEdges = useMemo<Edge[]>(
    () =>
      (roadmap?.edges ?? []).map((edge) => ({
        id: `${edge.prerequisiteNodeKey}-${edge.dependentNodeKey}`,
        source: edge.prerequisiteNodeKey,
        target: edge.dependentNodeKey,
        sourceHandle: 'source',
        targetHandle: 'target',
        focusable: false,
        style: { stroke: '#52635d', strokeWidth: 2 },
      })),
    [roadmap],
  )

  const closeNode = useCallback(() => query.setNode(null), [query])
  const continueChallenge = useCallback(() => {
    if (!roadmap?.recommendation) return
    const { recommendation } = roadmap
    contextStorage.set({
      revisionKey: roadmap.revision.key,
      nodeKey: recommendation.nodeKey,
      challengeId: recommendation.challengeId,
    })
    analytics.trackEvent('challenge_roadmap_continue_clicked', {
      revisionKey: roadmap.revision.key,
      nodeKey: recommendation.nodeKey,
      challengeId: recommendation.challengeId,
    })
    navigation.goTo(
      `${ROUTES.challenging.challenges.challenge(recommendation.challengeSlug)}?from=roadmap&node=${encodeURIComponent(recommendation.nodeKey)}`,
    )
  }, [analytics, contextStorage, navigation, roadmap])

  const openChallenge = useCallback(
    (challenge: RoadmapChallengeDto) => {
      if (!roadmap || !selectedNode) return
      contextStorage.set({
        revisionKey: roadmap.revision.key,
        nodeKey: selectedNode.key,
        challengeId: challenge.id ?? null,
      })
    },
    [contextStorage, roadmap, selectedNode],
  )

  return {
    roadmap,
    nodes,
    graphNodes,
    graphEdges,
    selectedNode,
    selectedNodeKey,
    error,
    isLoading,
    viewMode,
    setViewMode,
    revalidate,
    selectNode,
    closeNode,
    continueChallenge,
    openChallenge,
    viewportStorage,
    isAuthenticated: roadmap?.progress !== null && roadmap?.progress !== undefined,
  }
}
