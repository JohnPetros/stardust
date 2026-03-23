import { act, renderHook } from '@testing-library/react'

import { useChallengeNavigationAlertDialog } from '../useChallengeNavigationAlertDialog'

describe('useChallengeNavigationAlertDialog', () => {
  type Params = Parameters<typeof useChallengeNavigationAlertDialog>[0]

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useChallengeNavigationAlertDialog({
        onConfirm: jest.fn(),
        onCancel: jest.fn(),
        ...params,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call onConfirm when confirm handler is triggered', () => {
    const onConfirm = jest.fn()
    const { result } = Hook({ onConfirm })

    act(() => {
      result.current.handleConfirmClick()
    })

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when cancel handler is triggered', () => {
    const onCancel = jest.fn()
    const { result } = Hook({ onCancel })

    act(() => {
      result.current.handleCancelClick()
    })

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
