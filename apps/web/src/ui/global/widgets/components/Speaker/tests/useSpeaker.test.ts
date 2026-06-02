import { act, renderHook, waitFor } from '@testing-library/react'

import { useSpeaker } from '../useSpeaker'

describe('useSpeaker', () => {
  type Props = {
    url: string | null
    volume: number
    rate: number
    shouldAutoPlay: boolean
    isActive: boolean
  }

  const playMock = jest
    .spyOn(HTMLMediaElement.prototype, 'play')
    .mockImplementation(async () => undefined)
  const pauseMock = jest
    .spyOn(HTMLMediaElement.prototype, 'pause')
    .mockImplementation(() => undefined)

  const defaultProps: Props = {
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

  function Hook(props: Props = defaultProps) {
    return renderHook((currentProps) => useSpeaker(currentProps), {
      initialProps: props,
    })
  }

  function attachAudioElement(
    result: ReturnType<typeof Hook>['result'],
    rerender: ReturnType<typeof Hook>['rerender'],
    props: Props = defaultProps,
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

  it('should keep playing when volume changes', async () => {
    const { result, rerender } = Hook()

    attachAudioElement(result, rerender)
    const currentUrl = `${defaultProps.url}?attached=1`

    await act(async () => {
      await result.current.handleTogglePlay()
    })

    jest.clearAllMocks()

    rerender({ ...defaultProps, url: currentUrl, volume: 0.4 })

    expect(pauseMock).not.toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(true)
  })

  it('should pause when url becomes unavailable', async () => {
    const { result, rerender } = Hook()

    attachAudioElement(result, rerender)

    await act(async () => {
      await result.current.handleTogglePlay()
    })

    rerender({ ...defaultProps, url: null })

    expect(pauseMock).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(false)
  })
})
