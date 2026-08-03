import { act, fireEvent, renderHook } from '@testing-library/react'

import { useChallengeEditorBrowserNavigation } from '../useChallengeEditorBrowserNavigation'

class MockNavigation extends EventTarget {
  currentEntry: { key: string | null } = { key: 'editor' }
  traverseTo = jest.fn(() => Promise.resolve())
}

describe('useChallengeEditorBrowserNavigation', () => {
  let navigation: MockNavigation

  beforeEach(() => {
    navigation = new MockNavigation()
    Object.defineProperty(window, 'navigation', {
      configurable: true,
      value: navigation,
    })
    jest.spyOn(window, 'confirm')
  })

  afterEach(() => {
    jest.restoreAllMocks()
    Object.defineProperty(window, 'navigation', {
      configurable: true,
      value: undefined,
    })
  })

  it('protects beforeunload only while dirty and removes its listeners on cleanup', () => {
    const addEventListener = jest.spyOn(window, 'addEventListener')
    const removeEventListener = jest.spyOn(window, 'removeEventListener')
    const navigationRemoveEventListener = jest.spyOn(navigation, 'removeEventListener')
    const { unmount } = renderHook(() =>
      useChallengeEditorBrowserNavigation({ isDirty: true }),
    )
    const beforeUnload = new Event('beforeunload', {
      cancelable: true,
    }) as BeforeUnloadEvent

    window.dispatchEvent(beforeUnload)

    expect(beforeUnload.defaultPrevented).toBe(true)
    expect(beforeUnload.returnValue).toBe(false)
    // jsdom exposes `returnValue` as a boolean; the handler still assigns the
    // empty string required by browsers for the native prompt.
    expect(addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function))
    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), true)

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function))
    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), true)
    expect(navigationRemoveEventListener).toHaveBeenCalledWith(
      'navigate',
      expect.any(Function),
    )
    expect(navigationRemoveEventListener).toHaveBeenCalledWith(
      'currententrychange',
      expect.any(Function),
    )
  })

  it('does not register protection listeners when the form is clean', () => {
    const addEventListener = jest.spyOn(window, 'addEventListener')

    renderHook(() => useChallengeEditorBrowserNavigation({ isDirty: false }))

    expect(addEventListener).not.toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function),
    )
    expect(addEventListener).not.toHaveBeenCalledWith('click', expect.any(Function), true)
    expect(navigation).toHaveProperty('currentEntry')
  })

  it('requests only eligible internal links and allows a bypassed navigation once', () => {
    const onNavigationRequest = jest.fn()
    renderHook(() =>
      useChallengeEditorBrowserNavigation({ isDirty: true, onNavigationRequest }),
    )
    const anchor = document.body.appendChild(document.createElement('a'))
    anchor.href = '/profile'
    const child = anchor.appendChild(document.createElement('span'))

    fireEvent.click(child)

    expect(onNavigationRequest).toHaveBeenCalledTimes(1)
    expect(onNavigationRequest.mock.calls[0][0].href).toBe('http://localhost/profile')

    fireEvent.click(child, { ctrlKey: true })
    fireEvent.click(child, { button: 1 })
    anchor.download = 'challenge.json'
    fireEvent.click(child)
    expect(onNavigationRequest).toHaveBeenCalledTimes(1)

    const beforeUnload = new Event('beforeunload', {
      cancelable: true,
    }) as BeforeUnloadEvent
    act(() => onNavigationRequest.mock.calls[0][0].navigate())
    window.dispatchEvent(beforeUnload)
    expect(beforeUnload.defaultPrevented).toBe(true)
  })

  it('intercepts an eligible traversal, confirms it, and updates the committed entry key', async () => {
    const onNavigationAllowed = jest.fn()
    renderHook(() =>
      useChallengeEditorBrowserNavigation({ isDirty: true, onNavigationAllowed }),
    )
    const intercept = jest.fn()
    jest.mocked(window.confirm).mockReturnValue(true)
    const event = new Event('navigate') as Event & Record<string, unknown>
    Object.assign(event, {
      navigationType: 'traverse',
      canIntercept: true,
      destination: { key: 'previous', sameDocument: true },
      intercept,
    })

    navigation.dispatchEvent(event)
    expect(intercept).toHaveBeenCalledTimes(1)
    await act(async () => intercept.mock.calls[0][0].handler())

    expect(window.confirm).toHaveBeenCalledTimes(1)
    expect(onNavigationAllowed).toHaveBeenCalledTimes(1)
    expect(navigation.traverseTo).not.toHaveBeenCalled()

    navigation.currentEntry = { key: 'previous' }
    navigation.dispatchEvent(new Event('currententrychange'))

    const nextEvent = new Event('navigate') as Event & Record<string, unknown>
    Object.assign(nextEvent, {
      navigationType: 'traverse',
      canIntercept: true,
      destination: { key: 'next', sameDocument: true },
      intercept: jest.fn(),
    })
    navigation.dispatchEvent(nextEvent)
    expect(nextEvent.intercept).toHaveBeenCalledTimes(1)
  })

  it('consumes the confirmed traversal bypass once, including re-entry', async () => {
    const onNavigationAllowed = jest.fn(() => {
      const reentrantEvent = new Event('navigate') as Event & Record<string, unknown>
      Object.assign(reentrantEvent, {
        navigationType: 'traverse',
        canIntercept: true,
        destination: { key: 'previous', sameDocument: true },
        intercept: jest.fn(),
      })
      navigation.dispatchEvent(reentrantEvent)
      expect(reentrantEvent.intercept).not.toHaveBeenCalled()
    })
    renderHook(() =>
      useChallengeEditorBrowserNavigation({ isDirty: true, onNavigationAllowed }),
    )
    jest.mocked(window.confirm).mockReturnValue(true)
    const intercept = jest.fn()
    const event = new Event('navigate') as Event & Record<string, unknown>
    Object.assign(event, {
      navigationType: 'traverse',
      canIntercept: true,
      destination: { key: 'previous', sameDocument: true },
      intercept,
    })

    navigation.dispatchEvent(event)
    await act(async () => intercept.mock.calls[0][0].handler())

    const nextEvent = new Event('navigate') as Event & Record<string, unknown>
    Object.assign(nextEvent, {
      navigationType: 'traverse',
      canIntercept: true,
      destination: { key: 'next', sameDocument: true },
      intercept: jest.fn(),
    })
    navigation.dispatchEvent(nextEvent)

    expect(nextEvent.intercept).toHaveBeenCalledTimes(1)
    expect(window.confirm).toHaveBeenCalledTimes(1)
  })

  it('restores the protected entry and rejects the canceled traversal', async () => {
    const onNavigationRestored = jest.fn()
    renderHook(() =>
      useChallengeEditorBrowserNavigation({ isDirty: true, onNavigationRestored }),
    )
    jest.mocked(window.confirm).mockReturnValue(false)
    const intercept = jest.fn()
    const event = new Event('navigate') as Event & Record<string, unknown>
    Object.assign(event, {
      navigationType: 'traverse',
      canIntercept: true,
      destination: { key: 'previous', sameDocument: true },
      intercept,
    })

    navigation.dispatchEvent(event)
    await expect(intercept.mock.calls[0][0].handler()).rejects.toMatchObject({
      name: 'AbortError',
    })

    expect(navigation.traverseTo).toHaveBeenCalledWith('editor')
    expect(onNavigationRestored).toHaveBeenCalledTimes(1)
  })

  it('ignores unsupported traversals and mounts without an entry key safely', () => {
    const intercept = jest.fn()
    navigation.currentEntry = { key: null }
    renderHook(() => useChallengeEditorBrowserNavigation({ isDirty: true }))
    const event = new Event('navigate') as Event & Record<string, unknown>
    Object.assign(event, {
      navigationType: 'traverse',
      canIntercept: true,
      destination: { key: 'previous', sameDocument: true },
      intercept,
    })

    navigation.dispatchEvent(event)
    expect(intercept).not.toHaveBeenCalled()
  })
})
