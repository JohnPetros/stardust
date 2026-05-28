import { act, renderHook, waitFor } from '@testing-library/react'

import { useSpeaker } from '../useSpeaker'

describe('useSpeaker', () => {
  const playMock = jest
    .spyOn(HTMLMediaElement.prototype, 'play')
    .mockImplementation(async () => undefined)
  const pauseMock = jest
    .spyOn(HTMLMediaElement.prototype, 'pause')
    .mockImplementation(() => undefined)

  const defaultProps = {
    url: 'https://cdn.stardust/audio.wav',
    volume: 0.7,
    rate: 1.1,
    shouldAutoPlay: false,
    isActive: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    playMock.mockRestore()
    pauseMock.mockRestore()
  })

  function Hook(props = defaultProps) {
    return renderHook((currentProps) => useSpeaker(currentProps), {
      initialProps: props,
    })
  }

  function attachAudioElement(
    result: ReturnType<typeof Hook>['result'],
    rerender: ReturnType<typeof Hook>['rerender'],
    props = defaultProps,
  ) {
    act(() => {
      result.current.audioRef.current = document.createElement('audio')
    })

    rerender({
      ...props,
      url: `${props.url}?attached=1`,
    })
  }

  it('should toggle play and pause', async () => {
    const { result, rerender } = Hook()

    attachAudioElement(result, rerender)

    await act(async () => {
      await result.current.handleTogglePlay()
    })

    expect(playMock).toHaveBeenCalledTimes(1)
    expect(result.current.isPlaying).toBe(true)

    await act(async () => {
      await result.current.handleTogglePlay()
    })

    expect(pauseMock).toHaveBeenCalledTimes(1)
    expect(result.current.isPlaying).toBe(false)
  })

  it('should reset playing state when audio ends', async () => {
    const { result, rerender } = Hook()

    attachAudioElement(result, rerender)

    await act(async () => {
      await result.current.handleTogglePlay()
    })

    act(() => {
      result.current.audioRef.current?.dispatchEvent(new Event('ended'))
    })

    expect(result.current.isPlaying).toBe(false)
  })

  it('should pause when the chunk becomes inactive', async () => {
    const { result, rerender } = Hook()

    attachAudioElement(result, rerender)

    await act(async () => {
      await result.current.handleTogglePlay()
    })

    rerender({ ...defaultProps, isActive: false })

    expect(pauseMock).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(false)
  })

  it('should try autoplay when active and autoplay is enabled', async () => {
    const props = { ...defaultProps, shouldAutoPlay: true }
    const { result, rerender } = Hook(props)

    attachAudioElement(result, rerender, props)

    await waitFor(() => expect(playMock).toHaveBeenCalled())
  })
})
