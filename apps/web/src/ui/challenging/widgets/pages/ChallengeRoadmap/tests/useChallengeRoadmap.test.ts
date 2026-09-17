import { renderHook, act, waitFor } from '@testing-library/react'
import { useChallengeRoadmap } from '../useChallengeRoadmap'

const roadmap = {
  revision: { key: 'v1', version: 1, publishedAt: '2026-01-01' },
  nodes: [
    {
      key: 'basico',
      category: { name: 'Básico' },
      position: { x: 0, y: 0 },
      recommendationOrder: 1,
      state: 'content' as const,
      challengeIds: [],
      totalChallenges: 0,
      completedChallenges: 0,
      isCompleted: false,
      isEligible: true,
    },
  ],
  edges: [],
  progress: null,
  recommendation: null,
}
it('removes an invalid query selection and tracks the page view once', () => {
  const setNode = jest.fn()
  const analytics = { trackEvent: jest.fn(), identifyUser: jest.fn(), reset: jest.fn() }
  const { result } = renderHook(() =>
    useChallengeRoadmap({
      initialRoadmap: roadmap,
      service: { fetchChallengeRoadmap: jest.fn() } as any,
      analytics,
      navigation: { goTo: jest.fn() },
      query: { node: 'invalid', setNode },
      viewportStorage: { get: () => null, set: jest.fn() },
      contextStorage: { set: jest.fn() },
    }),
  )
  act(() => result.current.selectNode('basico'))
  expect(setNode).toHaveBeenCalledWith('basico')
  expect(analytics.trackEvent).toHaveBeenCalledWith('challenge_roadmap_viewed')
})

it('converts a rejected snapshot request into a retryable error state', async () => {
  const service = {
    fetchChallengeRoadmap: jest.fn().mockRejectedValue(new Error('offline')),
  }
  const { result } = renderHook(() =>
    useChallengeRoadmap({
      service: service as any,
      analytics: { trackEvent: jest.fn(), identifyUser: jest.fn(), reset: jest.fn() },
      navigation: { goTo: jest.fn() },
      query: { node: null, setNode: jest.fn() },
      viewportStorage: { get: () => null, set: jest.fn() },
      contextStorage: { set: jest.fn() },
    }),
  )

  await act(async () => {
    await result.current.revalidate()
  })
  await waitFor(() => expect(result.current.error).toBe('offline'))
  expect(result.current.isLoading).toBe(false)
})
