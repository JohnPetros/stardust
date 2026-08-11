import { act, render, screen } from '@testing-library/react'

import { useDeferredCodeSnippet } from '../useDeferredCodeSnippet'

function HookHarness() {
  const { containerRef, shouldLoad } = useDeferredCodeSnippet()

  return (
    <div ref={containerRef} data-testid='container'>
      {shouldLoad ? 'loaded' : 'deferred'}
    </div>
  )
}

describe('useDeferredCodeSnippet', () => {
  let observerCallback: IntersectionObserverCallback
  const observe = jest.fn()
  const disconnect = jest.fn()

  beforeEach(() => {
    observe.mockClear()
    disconnect.mockClear()

    global.IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
      observerCallback = callback
      return { observe, disconnect } as unknown as IntersectionObserver
    })
  })

  it('should defer loading until its container approaches the viewport', () => {
    render(<HookHarness />)

    expect(screen.getByTestId('container')).toHaveTextContent('deferred')
    expect(observe).toHaveBeenCalledWith(screen.getByTestId('container'))
  })

  it('should load once its container intersects the preload margin', () => {
    render(<HookHarness />)

    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    })

    expect(screen.getByTestId('container')).toHaveTextContent('loaded')
    expect(disconnect).toHaveBeenCalled()
  })
})
