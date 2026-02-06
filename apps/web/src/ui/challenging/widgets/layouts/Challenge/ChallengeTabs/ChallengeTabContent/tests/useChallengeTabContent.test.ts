import { act, renderHook } from '@testing-library/react'
import type { RefObject } from 'react'

import { useChallengeTabContent } from '../useChallengeTabContent'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'

jest.mock('@/ui/global/hooks/useNavigationProvider')

describe('useChallengeTabContent', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should scroll to top when route changes', () => {
    const scrollTo = jest.fn()
    const contentRef = {
      current: { scrollTo },
    } as unknown as RefObject<HTMLDivElement>

    jest.mocked(useNavigationProvider).mockReturnValue({
      currentRoute: '/challenge',
      goTo: jest.fn(),
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
    } as ReturnType<typeof useNavigationProvider>)

    renderHook(() => useChallengeTabContent(contentRef))

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
  })

  it('should not scroll when route is missing', () => {
    const scrollTo = jest.fn()
    const contentRef = {
      current: { scrollTo },
    } as unknown as RefObject<HTMLDivElement>

    jest.mocked(useNavigationProvider).mockReturnValue({
      currentRoute: '',
      goTo: jest.fn(),
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
    } as ReturnType<typeof useNavigationProvider>)

    renderHook(() => useChallengeTabContent(contentRef))

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(scrollTo).not.toHaveBeenCalled()
  })
})
