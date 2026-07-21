import { act, renderHook } from '@testing-library/react'
import useSWRInfinite from 'swr/infinite'

import { AuthError } from '@stardust/core/global/errors'

import { useToastContext } from '../../contexts/ToastContext'
import { usePaginatedCache } from '../usePaginatedCache'

jest.mock('swr/infinite')
jest.mock('../../contexts/ToastContext')

describe('usePaginatedCache', () => {
  const showError = jest.fn()
  let swrConfig: {
    onError: (error: unknown) => void
    shouldRetryOnError: boolean
  }

  beforeEach(() => {
    jest.clearAllMocks()

    jest.mocked(useToastContext).mockReturnValue({
      show: jest.fn(),
      showSuccess: jest.fn(),
      showError,
    })

    jest.mocked(useSWRInfinite).mockImplementation((_getKey, _fetcher, config) => {
      swrConfig = config as typeof swrConfig

      return {
        data: [],
        error: undefined,
        isLoading: false,
        isValidating: false,
        size: 1,
        setSize: jest.fn(),
        mutate: jest.fn(),
      } as never
    })
  })

  function renderPaginatedCache() {
    return renderHook(() =>
      usePaginatedCache({
        key: 'items',
        fetcher: jest.fn(),
        itemsPerPage: 10,
      }),
    )
  }

  it('should not retry or show authentication errors from background requests', () => {
    renderPaginatedCache()

    act(() => swrConfig.onError(new AuthError('Conta não autorizada')))

    expect(swrConfig.shouldRetryOnError).toBe(false)
    expect(showError).not.toHaveBeenCalled()
  })

  it('should show a normalized message for other errors', () => {
    renderPaginatedCache()

    act(() => swrConfig.onError(new Error('Falha ao carregar dados')))

    expect(showError).toHaveBeenCalledWith('Falha ao carregar dados')
  })
})
