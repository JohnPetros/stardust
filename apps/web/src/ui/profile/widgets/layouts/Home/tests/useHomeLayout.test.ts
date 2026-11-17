import { act, renderHook } from '@testing-library/react'

import { type Params, useHomeLayout } from '../useHomeLayout'

describe('useHomeLayout', () => {
  let notifyUserChanges: jest.Mock
  let onSidebarToggle: jest.Mock
  let onAchievementsListHide: jest.Mock

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useHomeLayout({
        notifyUserChanges,
        isSidebarOpen: false,
        isAchievementsListVisible: false,
        onSidebarToggle,
        onAchievementsListHide,
        ...params,
      }),
    )

  beforeEach(() => {
    jest.useFakeTimers()
    notifyUserChanges = jest.fn()
    onSidebarToggle = jest.fn()
    onAchievementsListHide = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should start with the sidenav collapsed and toggle it', () => {
    const { result } = Hook()

    expect(result.current.isSidenavExpanded).toBe(false)

    act(() => result.current.toggleSidenav())
    expect(result.current.isSidenavExpanded).toBe(true)

    act(() => result.current.toggleSidenav())
    expect(result.current.isSidenavExpanded).toBe(false)
  })

  it('should show the transition and hide it after 4 seconds', () => {
    const { result } = Hook()

    expect(result.current.isTransitionVisible).toBe(true)

    act(() => {
      jest.advanceTimersByTime(3999)
    })
    expect(result.current.isTransitionVisible).toBe(true)

    act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(result.current.isTransitionVisible).toBe(false)
  })

  it('should close the open sidebar when the container is clicked', () => {
    const { result } = Hook({ isSidebarOpen: true })

    act(() => result.current.handleContainerClick())

    expect(onSidebarToggle).toHaveBeenCalledTimes(1)
    expect(onAchievementsListHide).not.toHaveBeenCalled()
  })

  it('should hide the visible achievements list when the container is clicked', () => {
    const { result } = Hook({ isAchievementsListVisible: true })

    act(() => result.current.handleContainerClick())

    expect(onAchievementsListHide).toHaveBeenCalledTimes(1)
    expect(onSidebarToggle).not.toHaveBeenCalled()
  })

  it('should do nothing when the container is clicked with everything closed', () => {
    const { result } = Hook()

    act(() => result.current.handleContainerClick())

    expect(onSidebarToggle).not.toHaveBeenCalled()
    expect(onAchievementsListHide).not.toHaveBeenCalled()
  })

  it('should notify the user changes once after 320ms', () => {
    Hook()

    expect(notifyUserChanges).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(320)
    })
    expect(notifyUserChanges).toHaveBeenCalledTimes(1)

    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(notifyUserChanges).toHaveBeenCalledTimes(1)
  })

  it('should not notify the user changes when unmounted before 320ms', () => {
    const { unmount } = Hook()

    unmount()
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(notifyUserChanges).not.toHaveBeenCalled()
  })
})
