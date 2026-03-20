import { act, renderHook } from '@testing-library/react'
import type { RefObject } from 'react'
import { type Mock, mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import type { NavigationProvider } from '@stardust/core/global/interfaces'

import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'

import { useChallengeNavigationGuard } from '../useChallengeNavigationGuard'

jest.mock('@/ui/global/hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}))

describe('useChallengeNavigationGuard', () => {
  let challenge: ReturnType<typeof ChallengesFaker.fake>
  let navigationProvider: Mock<NavigationProvider>
  let dialogRef: RefObject<AlertDialogRef | null>
  let open: jest.Mock
  let close: jest.Mock
  let localStorageGet: jest.Mock
  let localStorageRemove: jest.Mock

  type Params = Parameters<typeof useChallengeNavigationGuard>[0]

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useChallengeNavigationGuard({
        challenge,
        navigationProvider,
        dialogRef,
        ...params,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()

    challenge = ChallengesFaker.fake({ code: 'escreva("ola")' })
    navigationProvider = mock<NavigationProvider>()
    navigationProvider.goTo.mockImplementation(jest.fn())
    navigationProvider.goBack.mockImplementation(jest.fn())
    navigationProvider.refresh.mockImplementation(jest.fn())
    navigationProvider.openExternal.mockImplementation(jest.fn())
    navigationProvider.currentRoute = '/challenging/challenges/current/challenge'

    open = jest.fn()
    close = jest.fn()
    dialogRef = {
      current: {
        open,
        close,
      },
    } as RefObject<AlertDialogRef | null>

    localStorageGet = jest.fn()
    localStorageRemove = jest.fn()

    jest.mocked(useLocalStorage).mockReturnValue({
      get: localStorageGet,
      set: jest.fn(),
      has: jest.fn(),
      remove: localStorageRemove,
    } as ReturnType<typeof useLocalStorage>)
  })

  it('should navigate immediately when there is no saved draft', () => {
    localStorageGet.mockReturnValue(null)

    const { result } = Hook()

    act(() => {
      result.current.requestNavigation('/challenging/challenges/next/challenge')
    })

    expect(navigationProvider.goTo).toHaveBeenCalledWith(
      '/challenging/challenges/next/challenge',
    )
    expect(open).not.toHaveBeenCalled()
  })

  it('should navigate immediately when the saved draft matches the current code', () => {
    localStorageGet.mockReturnValue(challenge.code)

    const { result } = Hook()

    act(() => {
      result.current.requestNavigation('/challenging/challenges/previous/challenge')
    })

    expect(result.current.isDirty()).toBe(false)
    expect(navigationProvider.goTo).toHaveBeenCalledWith(
      '/challenging/challenges/previous/challenge',
    )
    expect(open).not.toHaveBeenCalled()
  })

  it('should open the confirmation dialog and defer navigation when there are unsaved changes', () => {
    localStorageGet.mockReturnValue('escreva("rascunho")')

    const { result } = Hook()

    act(() => {
      result.current.requestNavigation('/challenging/challenges/next/challenge')
    })

    expect(result.current.isDirty()).toBe(true)
    expect(open).toHaveBeenCalledTimes(1)
    expect(navigationProvider.goTo).not.toHaveBeenCalled()
  })

  it('should discard the draft and navigate to the pending route when confirming', () => {
    localStorageGet.mockReturnValue('escreva("rascunho")')

    const { result } = Hook()

    act(() => {
      result.current.requestNavigation('/challenging/challenges/next/challenge')
    })

    act(() => {
      result.current.confirmNavigation()
    })

    expect(localStorageRemove).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)
    expect(navigationProvider.goTo).toHaveBeenCalledWith(
      '/challenging/challenges/next/challenge',
    )
  })

  it('should close the dialog and stay on the current page when canceling dirty navigation', () => {
    localStorageGet.mockReturnValue('escreva("rascunho")')

    const { result } = Hook()

    act(() => {
      result.current.requestNavigation('/challenging/challenges/next/challenge')
    })

    act(() => {
      result.current.cancelNavigation()
    })

    expect(close).toHaveBeenCalledTimes(1)
    expect(localStorageRemove).not.toHaveBeenCalled()
    expect(navigationProvider.goTo).not.toHaveBeenCalled()
  })
})
