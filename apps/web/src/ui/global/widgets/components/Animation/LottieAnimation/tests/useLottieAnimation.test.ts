import { renderHook, waitFor } from '@testing-library/react'

import { LOTTIE_PATHS } from '../lotties'
import { type Params, useLottieAnimation } from '../useLottieAnimation'

describe('useLottieAnimation', () => {
  const lottieRef = {
    current: {
      goToAndStop: jest.fn(),
      goToAndPlay: jest.fn(),
      setSpeed: jest.fn(),
    },
  } as unknown as Params['lottieRef']
  let fetchMock: jest.Mock
  let urlCount = 0

  function createUrl() {
    urlCount += 1
    return `/lotties/galaxies/test-${urlCount}.json`
  }

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useLottieAnimation({
        lottieRef,
        name: 'galaxy',
        hasLoop: true,
        isStatic: false,
        ...params,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ layers: [] }),
    })
    global.fetch = fetchMock as unknown as typeof fetch
  })

  it('should load the animation from the src when it is provided', async () => {
    const src = createUrl()

    const { result } = Hook({ src })

    await waitFor(() => expect(result.current.lottieData).toEqual({ layers: [] }))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe(src)
  })

  it('should load the animation from the name path when src is not provided', async () => {
    const { result } = Hook({ name: 'coins' })

    await waitFor(() => expect(result.current.lottieData).toEqual({ layers: [] }))
    expect(fetchMock.mock.calls[0][0]).toBe(LOTTIE_PATHS.coins)
  })

  it('should use the cache on a second mount with the same url', async () => {
    const src = createUrl()
    const first = Hook({ src })
    await waitFor(() => expect(first.result.current.lottieData).not.toBeNull())

    const second = Hook({ src })

    expect(second.result.current.lottieData).toEqual({ layers: [] })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should keep the animation data empty when the request fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, json: async () => ({}) })

    const { result } = Hook({ src: createUrl() })

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    expect(result.current.lottieData).toBeNull()
  })

  it('should autoplay and loop by default', async () => {
    const { result } = Hook({ src: createUrl() })

    await waitFor(() => expect(result.current.lottieData).not.toBeNull())
    expect(result.current.shouldAutoplay).toBe(true)
    expect(result.current.shouldLoop).toBe(true)
  })

  it('should respect hasLoop when the animation is not static', async () => {
    const { result } = Hook({ src: createUrl(), hasLoop: false })

    await waitFor(() => expect(result.current.lottieData).not.toBeNull())
    expect(result.current.shouldLoop).toBe(false)
  })

  it('should turn off autoplay and loop when the animation is static', async () => {
    const { result } = Hook({ src: createUrl(), isStatic: true })

    await waitFor(() => expect(result.current.lottieData).not.toBeNull())
    expect(result.current.shouldAutoplay).toBe(false)
    expect(result.current.shouldLoop).toBe(false)
  })

  it('should stop at the first frame when the animation is static and loaded', async () => {
    const { result } = Hook({ src: createUrl(), isStatic: true })

    await waitFor(() => expect(result.current.lottieData).not.toBeNull())

    expect(lottieRef.current?.goToAndStop).toHaveBeenCalledWith(0, true)
  })
})
