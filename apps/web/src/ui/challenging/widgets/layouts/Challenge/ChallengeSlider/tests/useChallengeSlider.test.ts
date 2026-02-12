import { act, renderHook } from '@testing-library/react'

import { useChallengeSlider } from '../useChallengeSlider'

jest.mock('swiper/element', () => ({
  register: jest.fn(),
}))

jest.mock('motion/react', () => {
  const animateMock = jest.fn()

  return {
    useAnimate: () => [{ current: { scope: true } }, animateMock],
    __animateMock: animateMock,
  }
})

describe('useChallengeSlider', () => {
  beforeEach(() => {
    const { __animateMock } = jest.requireMock('motion/react') as {
      __animateMock: jest.Mock
    }

    __animateMock.mockClear()
  })

  type Params = Parameters<typeof useChallengeSlider>[0]

  const Hook = (params?: Partial<Params>) =>
    renderHook((props: Params) => useChallengeSlider(props), {
      initialProps: {
        tabHandler: null,
        activeContent: 'description',
        isMobile: true,
        slidesCount: 4,
        onSetTabHandler: jest.fn(),
        ...params,
      } as Params,
    })

  it('should register tab handler when mobile and missing', () => {
    const onSetTabHandler = jest.fn()

    Hook({ onSetTabHandler })

    expect(onSetTabHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        showResultTab: expect.any(Function),
        showCodeTab: expect.any(Function),
        showAssistantTab: expect.any(Function),
      }),
    )
  })

  it('should navigate to result tab when activeContent is result', () => {
    const tabHandler = {
      showResultTab: jest.fn(),
      showCodeTab: jest.fn(),
      showAssistantTab: jest.fn(),
    }
    const { result, rerender } = Hook({ tabHandler, activeContent: 'comments' })
    const slideTo = jest.fn()

    act(() => {
      result.current.swiperRef.current = { swiper: { slideTo } } as any
    })

    rerender({
      tabHandler,
      activeContent: 'result',
      isMobile: true,
      slidesCount: 4,
      onSetTabHandler: jest.fn(),
    } as Params)

    expect(slideTo).toHaveBeenCalledWith(2)
  })

  it('should navigate when nav button is clicked', () => {
    const { result } = Hook()
    const slideTo = jest.fn()

    act(() => {
      result.current.swiperRef.current = { swiper: { slideTo } } as any
    })

    act(() => {
      result.current.handleNavButtonClick(1)
    })

    expect(slideTo).toHaveBeenCalledWith(1)
  })

  it('should update active slide index and animate on slide change', () => {
    const { result } = Hook({ slidesCount: 4 })

    act(() => {
      result.current.handleSlideChange({ activeIndex: 2, translate: -20 } as any)
    })

    const { __animateMock } = jest.requireMock('motion/react') as {
      __animateMock: jest.Mock
    }

    expect(__animateMock).toHaveBeenCalledWith(
      { scope: true },
      { x: 5 },
      { ease: 'linear', duration: 0.2 },
    )
    expect(result.current.activeSlideIndex).toBe(2)
  })
})
