import { act, renderHook } from '@testing-library/react'
import type { CodePlaybackDto } from '@stardust/core/global/structures/dtos'

import { useCodePlayback } from '../useCodePlayback'

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)

    for (const child of Object.values(value)) {
      deepFreeze(child)
    }
  }

  return value
}

const playbackFixture = deepFreeze({
  code: 'escreva(1)\nescreva(2)\nescreva(3)',
  input: {
    content: '1\n  2',
    overflow: 'wrap',
  },
  steps: [
    {
      activeLineRanges: [{ startLine: 1, endLine: 1 }],
      explanation: 'Primeira etapa',
      panels: [
        {
          type: 'scalar',
          title: 'resultado',
          value: 1,
        },
      ],
    },
    {
      activeLineRanges: [{ startLine: 2, endLine: 2 }],
      explanation: 'Segunda etapa',
      panels: [
        {
          type: 'scalar',
          title: 'resultado',
          value: 2,
        },
      ],
    },
    {
      activeLineRanges: [{ startLine: 3, endLine: 3 }],
      explanation: 'Terceira etapa',
      panels: [
        {
          type: 'scalar',
          title: 'resultado',
          value: 3,
        },
      ],
    },
  ],
} satisfies CodePlaybackDto) as CodePlaybackDto

const secondPlaybackFixture = deepFreeze({
  ...playbackFixture,
  code: 'escreva(4)\nescreva(5)',
  steps: [
    {
      ...playbackFixture.steps[0],
      explanation: 'Novo payload',
    },
  ],
} satisfies CodePlaybackDto) as CodePlaybackDto

function renderCodePlayback(playback = playbackFixture) {
  return renderHook(() => useCodePlayback({ playback }))
}

describe('useCodePlayback', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('starts at the first step paused at the default speed and layout', () => {
    const { result } = renderCodePlayback()

    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.currentStep).toBe(playbackFixture.steps[0])
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.speed).toBe('1x')
    expect(result.current.isExpanded).toBe(false)
    expect(jest.getTimerCount()).toBe(0)
  })

  it('starts and pauses playback with one timer', () => {
    const { result } = renderCodePlayback()

    act(() => result.current.play())
    expect(result.current.isPlaying).toBe(true)
    expect(jest.getTimerCount()).toBe(1)

    act(() => result.current.pause())
    expect(result.current.isPlaying).toBe(false)
    expect(jest.getTimerCount()).toBe(0)
  })

  it('keeps autoplay while navigating and clamps manual navigation to the limits', () => {
    const { result } = renderCodePlayback()

    act(() => {
      result.current.goToPreviousStep()
      result.current.play()
      result.current.goToNextStep()
      result.current.seek(2)
      result.current.goToNextStep()
      result.current.seek(-1)
      result.current.seek(3)
    })

    expect(result.current.currentStepIndex).toBe(2)
    expect(result.current.isPlaying).toBe(true)
    expect(jest.getTimerCount()).toBe(1)

    act(() => result.current.goToPreviousStep())
    expect(result.current.currentStepIndex).toBe(1)
    expect(result.current.isPlaying).toBe(true)

    act(() => jest.advanceTimersByTime(1000))
    expect(result.current.currentStepIndex).toBe(2)
    expect(result.current.isPlaying).toBe(false)
    expect(jest.getTimerCount()).toBe(0)
  })

  it.each([
    ['0.5x', 2000],
    ['1x', 1000],
    ['2x', 500],
  ] as const)('uses the %s interval and pauses at the end', (nextSpeed, interval) => {
    const { result } = renderCodePlayback()

    act(() => {
      result.current.changeSpeed(nextSpeed)
      result.current.play()
    })

    act(() => jest.advanceTimersByTime(interval - 1))
    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.isPlaying).toBe(true)

    act(() => jest.advanceTimersByTime(1))
    expect(result.current.currentStepIndex).toBe(1)
    expect(result.current.isPlaying).toBe(true)

    act(() => jest.advanceTimersByTime(interval))
    expect(result.current.currentStepIndex).toBe(2)
    expect(result.current.isPlaying).toBe(false)
    expect(jest.getTimerCount()).toBe(0)
  })

  it('replaces the timer when the speed changes during playback', () => {
    const { result } = renderCodePlayback()

    act(() => result.current.play())
    expect(jest.getTimerCount()).toBe(1)

    act(() => result.current.changeSpeed('2x'))
    expect(result.current.speed).toBe('2x')
    expect(jest.getTimerCount()).toBe(1)

    act(() => jest.advanceTimersByTime(499))
    expect(result.current.currentStepIndex).toBe(0)

    act(() => jest.advanceTimersByTime(1))
    expect(result.current.currentStepIndex).toBe(1)
    expect(jest.getTimerCount()).toBe(1)
  })

  it('preserves playback state when expanding and collapsing, including Escape', () => {
    const { result } = renderCodePlayback()

    act(() => {
      result.current.changeSpeed('2x')
      result.current.play()
      result.current.goToNextStep()
      result.current.toggleExpanded()
    })

    expect(result.current.currentStepIndex).toBe(1)
    expect(result.current.speed).toBe('2x')
    expect(result.current.isPlaying).toBe(true)
    expect(result.current.isExpanded).toBe(true)
    expect(jest.getTimerCount()).toBe(1)

    act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })))

    expect(result.current.isExpanded).toBe(false)
    expect(result.current.currentStepIndex).toBe(1)
    expect(result.current.speed).toBe('2x')
    expect(result.current.isPlaying).toBe(true)
    expect(jest.getTimerCount()).toBe(1)
  })

  it('resets state and cleans the timer when the payload changes', () => {
    const { result, rerender } = renderHook(
      ({ playback }: { playback: CodePlaybackDto }) => useCodePlayback({ playback }),
      { initialProps: { playback: playbackFixture } },
    )

    act(() => {
      result.current.changeSpeed('2x')
      result.current.play()
      result.current.toggleExpanded()
      result.current.goToNextStep()
    })
    expect(jest.getTimerCount()).toBe(1)

    rerender({ playback: secondPlaybackFixture })

    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.currentStep).toBe(secondPlaybackFixture.steps[0])
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.speed).toBe('1x')
    expect(result.current.isExpanded).toBe(false)
    expect(jest.getTimerCount()).toBe(0)
  })

  it('keeps the rendered snapshot valid when the new payload has fewer steps', () => {
    const renderedSnapshots: Array<{
      playback: CodePlaybackDto
      currentStepIndex: number
      currentStep: CodePlaybackDto['steps'][number]
      isPlaying: boolean
      speed: string
      isExpanded: boolean
    }> = []
    const { result, rerender } = renderHook(
      ({ playback }: { playback: CodePlaybackDto }) => {
        const value = useCodePlayback({ playback })
        renderedSnapshots.push({
          playback,
          currentStepIndex: value.currentStepIndex,
          currentStep: value.currentStep,
          isPlaying: value.isPlaying,
          speed: value.speed,
          isExpanded: value.isExpanded,
        })
        return value
      },
      { initialProps: { playback: playbackFixture } },
    )

    act(() => result.current.seek(2))
    rerender({ playback: secondPlaybackFixture })

    const payloadChangeSnapshots = renderedSnapshots.filter(
      ({ playback }) => playback === secondPlaybackFixture,
    )

    expect(payloadChangeSnapshots.length).toBeGreaterThan(0)
    for (const snapshot of payloadChangeSnapshots) {
      expect(snapshot.currentStepIndex).toBe(0)
      expect(snapshot.currentStep).toBe(secondPlaybackFixture.steps[0])
      expect(snapshot.isPlaying).toBe(false)
      expect(snapshot.speed).toBe('1x')
      expect(snapshot.isExpanded).toBe(false)
    }
  })

  it('cleans the timer on unmount and does not execute external effects', () => {
    const requestSpy = jest.fn()
    const lspSpy = jest.fn()
    const executionSpy = jest.fn()
    const { result, unmount } = renderCodePlayback()

    act(() => result.current.play())
    unmount()
    act(() => jest.advanceTimersByTime(5000))

    expect(jest.getTimerCount()).toBe(0)
    expect(requestSpy).not.toHaveBeenCalled()
    expect(lspSpy).not.toHaveBeenCalled()
    expect(executionSpy).not.toHaveBeenCalled()
    expect(playbackFixture.input.content).toBe('1\n  2')
    expect(playbackFixture.steps[0].panels[0]).toEqual({
      type: 'scalar',
      title: 'resultado',
      value: 1,
    })
  })

  it('navigates a frozen fixture without mutating the DTO', () => {
    const before = JSON.stringify(playbackFixture)
    const { result } = renderCodePlayback()

    act(() => {
      result.current.play()
      result.current.seek(1)
      result.current.goToPreviousStep()
      result.current.goToNextStep()
    })

    expect(JSON.stringify(playbackFixture)).toBe(before)
  })
})
