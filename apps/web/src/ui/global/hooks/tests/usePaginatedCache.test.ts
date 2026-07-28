import { act, renderHook } from '@testing-library/react'
import useSWRInfinite from 'swr/infinite'

import { AuthError } from '@stardust/core/global/errors'

import { useToastContext } from '../../contexts/ToastContext'
import { usePaginatedCache } from '../usePaginatedCache'

jest.mock('swr/infinite')
jest.mock('../../contexts/ToastContext')

describe('usePaginatedCache', () => {
  const showError = jest.fn()
  const fetcher = jest.fn()
  let swrConfig: {
    onError: (error: unknown) => void
    shouldRetryOnError: boolean
  }
  let getKey: (
    pageIndex: number,
    previousPageData: unknown[] | null | undefined,
  ) => readonly [string, number] | null
  let infiniteFetcher: (key: readonly [string, number]) => Promise<unknown[]>
  let swrData: unknown[][] = []

  beforeEach(() => {
    jest.clearAllMocks()
    swrData = []
    fetcher.mockResolvedValue({ items: [], totalItemsCount: 0 })

    jest.mocked(useToastContext).mockReturnValue({
      show: jest.fn(),
      showSuccess: jest.fn(),
      showError,
    })

    jest.mocked(useSWRInfinite).mockImplementation((_getKey, _fetcher, config) => {
      getKey = _getKey as typeof getKey
      infiniteFetcher = _fetcher as typeof infiniteFetcher
      swrConfig = config as typeof swrConfig

      return {
        data: swrData,
        error: undefined,
        isLoading: false,
        isValidating: false,
        size: 1,
        setSize: jest.fn(),
        mutate: jest.fn(),
      } as never
    })
  })

  function renderPaginatedCache(params?: {
    dependencies?: unknown[]
    isEnabled?: boolean
    itemsPerPage?: number
  }) {
    return renderHook(() =>
      usePaginatedCache({
        key: 'items',
        fetcher,
        itemsPerPage: params?.itemsPerPage ?? 10,
        dependencies: params?.dependencies,
        isEnabled: params?.isEnabled,
      }),
    )
  }

  it('should pass structured numeric page keys to the domain fetcher', async () => {
    renderPaginatedCache()

    const firstPageKey = getKey(0, null)
    const initialPageKey = getKey(0, undefined)
    const secondPageKey = getKey(1, ['first page'])

    expect(firstPageKey).toEqual([expect.any(String), 1])
    expect(initialPageKey).toEqual(firstPageKey)
    expect(secondPageKey).toEqual([firstPageKey?.[0], 2])

    if (!firstPageKey || !secondPageKey) {
      throw new Error('Expected structured pagination keys')
    }

    await act(async () => {
      await infiniteFetcher(firstPageKey)
      await infiniteFetcher(secondPageKey)
    })

    expect(fetcher).toHaveBeenNthCalledWith(1, 1)
    expect(fetcher).toHaveBeenNthCalledWith(2, 2)
  })

  it('should reject invalid pages before calling the domain fetcher', async () => {
    renderPaginatedCache()

    await expect(infiniteFetcher(['items', 0])).rejects.toThrow(
      'Invalid pagination page: 0',
    )
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('should derive cache identity from key dependencies and items per page', () => {
    const config = {
      dependencies: ['first dependency'],
      itemsPerPage: 10,
    }
    const { rerender } = renderHook(() =>
      usePaginatedCache({
        key: 'items',
        fetcher,
        ...config,
      }),
    )

    const initialIdentity = getKey(0, null)?.[0]

    rerender()
    expect(getKey(0, null)?.[0]).toBe(initialIdentity)

    config.dependencies = ['second dependency']
    rerender()
    const changedDependencyIdentity = getKey(0, null)?.[0]
    expect(changedDependencyIdentity).not.toBe(initialIdentity)

    config.itemsPerPage = 20
    rerender()
    expect(getKey(0, null)?.[0]).not.toBe(changedDependencyIdentity)
  })

  it('should disable pages and stop after an empty page', () => {
    const disabled = renderPaginatedCache({ isEnabled: false })
    expect(getKey(0, null)).toBeNull()
    disabled.unmount()

    swrData = [['last page item']]
    const { result } = renderPaginatedCache()
    expect(getKey(1, [])).toBeNull()
    expect(result.current.isReachedEnd).toBe(true)
  })

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
