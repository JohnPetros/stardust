import { act, renderHook, waitFor } from '@testing-library/react'
import { useRoadmapChallengeDrawer } from '../useRoadmapChallengeDrawer'

it('fetches node challenges and exposes retryable state', async () => {
  const service = {
    fetchRoadmapNodeChallenges: jest.fn().mockResolvedValue({
      isFailure: false,
      body: { nodeKey: 'basico', challenges: [] },
    }),
  } as any
  renderHook(() =>
    useRoadmapChallengeDrawer({
      isOpen: true,
      node: {
        key: 'basico',
        category: { name: 'Básico' },
        position: { x: 0, y: 0 },
        recommendationOrder: 1,
        state: 'content',
        challengeIds: [],
        totalChallenges: 0,
        completedChallenges: 0,
        isCompleted: false,
        isEligible: true,
      },
      service,
      analytics: { trackEvent: jest.fn(), identifyUser: jest.fn(), reset: jest.fn() },
      revisionKey: 'v1',
      onClose: jest.fn(),
      onOpenChallenge: jest.fn(),
    }),
  )
  await waitFor(() => expect(service.fetchRoadmapNodeChallenges).toHaveBeenCalled())
})

it('converts a rejected node request into a retryable error state', async () => {
  const fetchRoadmapNodeChallenges = jest.fn().mockRejectedValue(new Error('offline'))
  const service = { fetchRoadmapNodeChallenges } as any
  const analytics = { trackEvent: jest.fn(), identifyUser: jest.fn(), reset: jest.fn() }
  const node = {
    key: 'basico',
    category: { name: 'Básico' },
    position: { x: 0, y: 0 },
    recommendationOrder: 1,
    state: 'content' as const,
    challengeIds: [],
    totalChallenges: 0,
    completedChallenges: null,
    isCompleted: null,
    isEligible: null,
  }
  const { result } = renderHook(() =>
    useRoadmapChallengeDrawer({
      isOpen: true,
      node,
      service,
      analytics,
      revisionKey: 'v1',
      onClose: jest.fn(),
      onOpenChallenge: jest.fn(),
    }),
  )

  await waitFor(() => expect(result.current.error).toBe('offline'))

  fetchRoadmapNodeChallenges.mockResolvedValueOnce({
    isFailure: false,
    body: { nodeKey: 'basico', challenges: [] },
  })
  await act(async () => {
    await result.current.retry()
  })
  expect(result.current.error).toBeNull()
})

it('emits one complete start event for a valid challenge', async () => {
  const analytics = { trackEvent: jest.fn(), identifyUser: jest.fn(), reset: jest.fn() }
  const service = {
    fetchRoadmapNodeChallenges: jest.fn().mockResolvedValue({
      isFailure: false,
      body: { nodeKey: 'basico', challenges: [] },
    }),
  } as any
  const { result } = renderHook(() =>
    useRoadmapChallengeDrawer({
      isOpen: true,
      node: {
        key: 'basico',
        category: { name: 'Básico' },
        position: { x: 0, y: 0 },
        recommendationOrder: 1,
        state: 'content',
        challengeIds: [],
        totalChallenges: 0,
        completedChallenges: null,
        isCompleted: null,
        isEligible: null,
      },
      service,
      analytics,
      revisionKey: 'v1',
      onClose: jest.fn(),
      onOpenChallenge: jest.fn(),
    }),
  )

  act(() => {
    result.current.handleChallengeOpen({ id: 'challenge-1', title: 'Desafio' } as any)
  })

  expect(analytics.trackEvent).toHaveBeenCalledTimes(1)
  expect(analytics.trackEvent).toHaveBeenCalledWith(
    'challenge_roadmap_challenge_started',
    { revisionKey: 'v1', nodeKey: 'basico', challengeId: 'challenge-1' },
  )
})
