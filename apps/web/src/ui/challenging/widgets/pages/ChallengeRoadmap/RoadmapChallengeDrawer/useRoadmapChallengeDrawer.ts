'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Slug } from '@stardust/core/global/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ClientAnalyticsProvider } from '@stardust/core/analytics/interfaces'
import type { RoadmapNodeDto } from '@stardust/core/challenging/structures/dtos'
import type { RoadmapChallengeDto } from '../types'

type Params = {
  isOpen: boolean
  node: RoadmapNodeDto | null
  service: ChallengingService
  analytics: ClientAnalyticsProvider
  recommendationId?: string
  revisionKey: string
  onClose: () => void
  onOpenChallenge: (challenge: RoadmapChallengeDto) => void
}

export function useRoadmapChallengeDrawer({
  isOpen,
  node,
  service,
  analytics,
  recommendationId,
  revisionKey,
  onClose,
  onOpenChallenge,
}: Params) {
  const [challenges, setChallenges] = useState<RoadmapChallengeDto[]>([])
  const [filteredChallenges, setFilteredChallenges] = useState<RoadmapChallengeDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wasOpen = useRef(false)
  const requestToken = useRef(0)
  const openerRef = useRef<HTMLElement | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const nodeKey = node?.key
  const nodeState = node?.state

  const fetchChallenges = useCallback(async () => {
    const currentToken = ++requestToken.current
    if (!nodeKey || nodeState === 'comingSoon') {
      setChallenges([])
      setFilteredChallenges([])
      setIsLoading(false)
      setError(null)
      return
    }
    setChallenges([])
    setFilteredChallenges([])
    setIsLoading(true)
    setError(null)
    try {
      const response = await service.fetchRoadmapNodeChallenges(Slug.create(nodeKey))
      if (currentToken !== requestToken.current) return
      if (response.isFailure) setError(response.errorMessage)
      else {
        setChallenges(response.body.challenges)
        setFilteredChallenges(response.body.challenges)
      }
    } catch (caughtError) {
      if (currentToken !== requestToken.current) return
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível carregar os desafios desta categoria.',
      )
    } finally {
      if (currentToken === requestToken.current) setIsLoading(false)
    }
  }, [nodeKey, nodeState, service])

  useEffect(() => {
    if (!isOpen || !node) return
    void fetchChallenges()
  }, [fetchChallenges, isOpen, nodeKey])

  const handleClose = useCallback(() => {
    wasOpen.current = false
    const opener = openerRef.current
    if (opener?.isConnected) {
      opener.focus()
    } else {
      const fallback = [
        ...document.querySelectorAll<HTMLElement>('[data-roadmap-node]'),
      ].find((element) => element.dataset.roadmapNode === node?.key)
      fallback?.focus()
    }
    openerRef.current = null
    onClose()
  }, [node?.key, onClose])

  useEffect(() => {
    if (!isOpen) {
      wasOpen.current = false
      return
    }

    if (!wasOpen.current) {
      const activeElement = document.activeElement
      if (activeElement instanceof HTMLElement && activeElement !== document.body)
        openerRef.current = activeElement
      wasOpen.current = true
      const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )
      const focusTarget = firstFocusable ?? drawerRef.current
      focusTarget?.focus()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
        return
      }
      if (event.key !== 'Tab' || !drawerRef.current) return

      const focusableElements = [
        ...drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ]
      if (focusableElements.length === 0) {
        event.preventDefault()
        drawerRef.current.focus()
        return
      }

      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement,
      )
      const shouldWrapBackward =
        event.shiftKey && (currentIndex <= 0 || currentIndex === -1)
      const shouldWrapForward =
        !event.shiftKey &&
        (currentIndex === focusableElements.length - 1 || currentIndex === -1)

      if (!shouldWrapBackward && !shouldWrapForward) return
      event.preventDefault()
      const nextIndex = shouldWrapBackward ? focusableElements.length - 1 : 0
      focusableElements[nextIndex]?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [handleClose, isOpen])

  const handleChallengeOpen = useCallback(
    (challenge: RoadmapChallengeDto) => {
      if (!node || !revisionKey || !challenge.id) return
      onOpenChallenge(challenge)
      analytics.trackEvent('challenge_roadmap_challenge_started', {
        revisionKey,
        nodeKey: node.key,
        challengeId: challenge.id,
      })
    },
    [analytics, node, onOpenChallenge, revisionKey],
  )

  return {
    challenges,
    filteredChallenges,
    setFilteredChallenges,
    isLoading,
    error,
    drawerRef,
    retry: fetchChallenges,
    handleChallengeOpen,
    recommendationId,
    onClose: handleClose,
  }
}
