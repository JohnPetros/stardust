import { act, renderHook } from '@testing-library/react'

import { useToast } from '../useToast'

jest.mock('motion/react', () => ({
  useAnimate: () => [{ current: null }, jest.fn()],
}))

describe('useToast', () => {
  beforeEach(() => {
    jest.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('resets the toast animation when it is opened again while visible', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.open({ type: 'error', message: 'Erro' })
    })

    const firstAnimationKey = result.current.animationKey

    act(() => {
      result.current.open({ type: 'error', message: 'Erro' })
    })

    expect(result.current.animationKey).toBe(firstAnimationKey + 1)
  })
})
