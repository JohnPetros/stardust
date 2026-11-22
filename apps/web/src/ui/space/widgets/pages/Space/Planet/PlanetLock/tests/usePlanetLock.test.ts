import { act, renderHook } from '@testing-library/react'

import {
  FADE_DURATION_IN_MS,
  OPENING_DURATION_IN_MS,
  type Params,
  usePlanetLock,
} from '../usePlanetLock'

describe('usePlanetLock', () => {
  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      usePlanetLock({
        planetState: 'locked',
        isJustOpened: false,
        isReducedMotion: false,
        ...params,
      }),
    )

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should keep a locked planet static', () => {
    const { result } = Hook({ planetState: 'locked' })

    expect(result.current.phase).toBe('static')
  })

  it('should loop the lock of a liberated planet', () => {
    const { result } = Hook({ planetState: 'liberated' })

    expect(result.current.phase).toBe('loop')
  })

  it('should keep the lock of a liberated planet static with reduced motion', () => {
    const { result } = Hook({ planetState: 'liberated', isReducedMotion: true })

    expect(result.current.phase).toBe('static')
  })

  it('should hide the lock of a planet that was already opened', () => {
    const { result } = Hook({ planetState: 'opened', isJustOpened: false })

    expect(result.current.phase).toBe('hidden')
  })

  it('should play the opening once and hide the lock afterwards', () => {
    const { result } = Hook({ planetState: 'opened', isJustOpened: true })

    expect(result.current.phase).toBe('opening')

    act(() => {
      jest.advanceTimersByTime(OPENING_DURATION_IN_MS)
    })

    expect(result.current.phase).toBe('hidden')
  })

  it('should fade the lock when the planet opens with reduced motion', () => {
    const { result } = Hook({
      planetState: 'opened',
      isJustOpened: true,
      isReducedMotion: true,
    })

    expect(result.current.phase).toBe('fade')

    act(() => {
      jest.advanceTimersByTime(FADE_DURATION_IN_MS)
    })

    expect(result.current.phase).toBe('hidden')
  })

  it('should fade the lock when the animation fails to load', () => {
    const { result, rerender } = renderHook(
      ({ planetState, isJustOpened }: Pick<Params, 'planetState' | 'isJustOpened'>) =>
        usePlanetLock({ planetState, isJustOpened, isReducedMotion: false }),
      {
        initialProps: {
          planetState: 'liberated',
          isJustOpened: false,
        } as Pick<Params, 'planetState' | 'isJustOpened'>,
      },
    )

    act(() => {
      result.current.handleLoadError()
    })
    rerender({ planetState: 'opened', isJustOpened: true })

    expect(result.current.hasLoadFailed).toBe(true)
    expect(result.current.phase).toBe('fade')
  })
})
