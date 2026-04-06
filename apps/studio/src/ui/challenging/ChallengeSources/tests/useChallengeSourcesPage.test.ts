import { act, renderHook, waitFor } from '@testing-library/react'
import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengeSourceDto } from '@stardust/core/challenging/entities/dtos'
import { ChallengeSourcesFaker } from '@stardust/core/challenging/entities/fakers'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import { PaginationResponse, RestResponse } from '@stardust/core/global/responses'

import { useChallengeSourcesPage } from '../useChallengeSourcesPage'

const mockQueryStringParams: Record<string, [string, jest.Mock]> = {
  q: ['', jest.fn()],
}

const mockQueryNumberParams: Record<string, [number, jest.Mock]> = {
  page: [1, jest.fn()],
  limit: [10, jest.fn()],
}

const mockUseFetchReturn = {
  data: null as PaginationResponse<ChallengeSourceDto> | null,
  isLoading: false,
  isRefetching: false,
  refetch: jest.fn(),
}

jest.mock('@/ui/global/hooks/useFetch', () => ({
  useFetch: jest.fn(() => mockUseFetchReturn),
}))

jest.mock('@/ui/global/hooks/useDebounce', () => ({
  useDebounce: jest.fn((value: string) => value),
}))

jest.mock('@/ui/global/hooks/useQueryStringParam', () => ({
  useQueryStringParam: jest.fn((key: string, defaultValue: string) => {
    return mockQueryStringParams[key] ?? [defaultValue, jest.fn()]
  }),
}))

jest.mock('@/ui/global/hooks/useQueryNumberParam', () => ({
  useQueryNumberParam: jest.fn((key: string, defaultValue: number) => {
    return mockQueryNumberParams[key] ?? [defaultValue, jest.fn()]
  }),
}))

describe('useChallengeSourcesPage', () => {
  let challengingService: Mock<ChallengingService>
  let toastProvider: Mock<ToastProvider>

  const Hook = () =>
    renderHook(() =>
      useChallengeSourcesPage({
        challengingService,
        toastProvider,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()

    challengingService = mock<ChallengingService>()
    toastProvider = mock<ToastProvider>()

    toastProvider.showSuccess = jest.fn()
    toastProvider.showError = jest.fn()

    mockUseFetchReturn.data = new PaginationResponse({
      items: [],
      totalItemsCount: 0,
    })
    mockUseFetchReturn.isLoading = false
    mockUseFetchReturn.isRefetching = false
    mockUseFetchReturn.refetch = jest.fn()

    mockQueryStringParams.q = ['', jest.fn()]
    mockQueryNumberParams.page = [1, jest.fn()]
    mockQueryNumberParams.limit = [10, jest.fn()]
  })

  it('should map fetched challenge sources to view state', async () => {
    const validSource = ChallengeSourcesFaker.fakeDto({ id: 'source-1' })
    const invalidSource = ChallengeSourcesFaker.fakeDto({ id: '' })

    mockUseFetchReturn.data = new PaginationResponse({
      items: [validSource, invalidSource],
      totalItemsCount: 23,
    })

    const { result } = Hook()

    await waitFor(() => expect(result.current.challengeSources).toHaveLength(2))

    expect(result.current.totalItemsCount).toBe(23)
    expect(result.current.totalPages).toBe(3)
    expect(result.current.sortableChallengeSources).toEqual([
      {
        id: validSource.id,
        data: validSource,
      },
    ])
    expect(result.current.sortableKey).toBe(validSource.id)
  })

  it('should update search and reset page when search changes', () => {
    const setSearch = jest.fn()
    const setPage = jest.fn()

    mockQueryStringParams.q = ['', setSearch]
    mockQueryNumberParams.page = [4, setPage]

    const { result } = Hook()

    act(() => {
      result.current.onSearchChange('binary search')
    })

    expect(setSearch).toHaveBeenCalledWith('binary search')
    expect(setPage).toHaveBeenCalledWith(1)
  })

  it('should create challenge source successfully', async () => {
    const challengeId = '550e8400-e29b-41d4-a716-446655440015'
    const createdSource = ChallengeSourcesFaker.fakeDto({
      challenge: {
        id: challengeId,
        title: 'Desafio vinculado',
        slug: 'desafio-vinculado',
      },
    })
    const refetch = jest.fn()
    mockUseFetchReturn.refetch = refetch

    challengingService.createChallengeSource.mockResolvedValue(
      new RestResponse({ body: createdSource, statusCode: 201 }),
    )

    const { result } = Hook()

    let errorMessage: string | null = 'unexpected'
    await act(async () => {
      errorMessage = await result.current.onCreateChallengeSource(
        createdSource.url,
        challengeId,
      )
    })

    expect(errorMessage).toBeNull()
    expect(challengingService.createChallengeSource).toHaveBeenCalledWith(
      expect.objectContaining({ value: challengeId }),
      expect.objectContaining({ value: createdSource.url }),
      null,
    )
    expect(toastProvider.showSuccess).toHaveBeenCalledWith('Fonte criada com sucesso')
    expect(refetch).toHaveBeenCalled()
  })

  it('should return error message when challenge source creation fails', async () => {
    challengingService.createChallengeSource.mockResolvedValue(
      new RestResponse({ statusCode: 400, errorMessage: 'URL inválida' }),
    )

    const { result } = Hook()

    let errorMessage: string | null = null
    await act(async () => {
      errorMessage = await result.current.onCreateChallengeSource(
        'https://invalid-source.test',
        undefined,
      )
    })

    expect(errorMessage).toBe('URL inválida')
    expect(toastProvider.showSuccess).not.toHaveBeenCalled()
    expect(mockUseFetchReturn.refetch).not.toHaveBeenCalled()
  })

  it('should update challenge source successfully', async () => {
    const updatedSource = ChallengeSourcesFaker.fakeDto({
      id: '550e8400-e29b-41d4-a716-446655440099',
      url: 'https://updated-source.test',
      challenge: null,
    })
    const refetch = jest.fn()
    mockUseFetchReturn.refetch = refetch

    challengingService.updateChallengeSource.mockResolvedValue(
      new RestResponse({ body: updatedSource, statusCode: 200 }),
    )

    const { result } = Hook()

    let errorMessage: string | null = 'unexpected'
    await act(async () => {
      errorMessage = await result.current.onUpdateChallengeSource(
        updatedSource.id,
        updatedSource.url,
        undefined,
      )
    })

    expect(errorMessage).toBeNull()
    expect(challengingService.updateChallengeSource).toHaveBeenCalledWith(
      expect.objectContaining({ value: updatedSource.id }),
      expect.objectContaining({ value: updatedSource.url }),
      null,
      null,
    )
    expect(toastProvider.showSuccess).toHaveBeenCalledWith('Fonte atualizada com sucesso')
    expect(refetch).toHaveBeenCalled()
  })

  it('should show success toast and refetch when deleting challenge source succeeds', async () => {
    challengingService.deleteChallengeSource.mockResolvedValue(
      new RestResponse({ statusCode: 200 }),
    )

    const { result } = Hook()

    await act(async () => {
      await result.current.onDeleteChallengeSource('550e8400-e29b-41d4-a716-446655440011')
    })

    expect(challengingService.deleteChallengeSource).toHaveBeenCalledWith(
      expect.objectContaining({ value: '550e8400-e29b-41d4-a716-446655440011' }),
    )
    expect(toastProvider.showSuccess).toHaveBeenCalledWith('Fonte removida com sucesso')
    expect(mockUseFetchReturn.refetch).toHaveBeenCalled()
  })

  it('should show error toast when deleting challenge source fails', async () => {
    challengingService.deleteChallengeSource.mockResolvedValue(
      new RestResponse({ statusCode: 400, errorMessage: 'Fonte em uso' }),
    )

    const { result } = Hook()

    await act(async () => {
      await result.current.onDeleteChallengeSource('550e8400-e29b-41d4-a716-446655440012')
    })

    expect(toastProvider.showError).toHaveBeenCalledWith('Fonte em uso')
    expect(mockUseFetchReturn.refetch).not.toHaveBeenCalled()
  })

  it('should rollback reordered items when service returns failure', async () => {
    const sourceA = ChallengeSourcesFaker.fakeDto({
      id: '550e8400-e29b-41d4-a716-446655440013',
    })
    const sourceB = ChallengeSourcesFaker.fakeDto({
      id: '550e8400-e29b-41d4-a716-446655440014',
    })

    mockUseFetchReturn.data = new PaginationResponse({
      items: [sourceA, sourceB],
      totalItemsCount: 2,
    })
    challengingService.reorderChallengeSources.mockResolvedValue(
      new RestResponse({ statusCode: 400, errorMessage: 'Não foi possível reordenar' }),
    )

    const { result } = Hook()

    await waitFor(() =>
      expect(result.current.challengeSources).toEqual([sourceA, sourceB]),
    )

    await act(async () => {
      await result.current.onReorderChallengeSources([sourceB, sourceA])
    })

    await waitFor(() =>
      expect(result.current.challengeSources).toEqual([sourceA, sourceB]),
    )
    expect(toastProvider.showError).toHaveBeenCalledWith('Não foi possível reordenar')
  })
})
