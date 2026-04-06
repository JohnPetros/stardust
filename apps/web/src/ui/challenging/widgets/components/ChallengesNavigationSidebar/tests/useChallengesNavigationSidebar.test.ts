import { act, renderHook, waitFor } from '@testing-library/react'
import { type Mock, mock } from 'ts-jest-mocker'

import {
  ChallengesFaker,
  ChallengeCategoriesFaker,
} from '@stardust/core/challenging/entities/fakers'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { PaginationResponse, RestResponse } from '@stardust/core/global/responses'

import { useChallengesNavigationSidebar } from '../useChallengesNavigationSidebar'

type Params = Parameters<typeof useChallengesNavigationSidebar>[0]
type RestResponseProps<T> = { body?: T; statusCode?: number; errorMessage?: string }

function createRestResponse<T>(props: RestResponseProps<T>) {
  return new RestResponse<T>(props)
}

describe('useChallengesNavigationSidebar', () => {
  let challengingService: Mock<ChallengingService>
  let onClose: jest.Mock
  let onChallengeSelect: jest.Mock

  const challenge = ChallengesFaker.fakeDto({ slug: 'current-challenge' })
  const category = ChallengeCategoriesFaker.fakeDto()

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useChallengesNavigationSidebar({
        isOpen: true,
        currentChallengeSlug: 'current-challenge',
        challengingService,
        isAccountAuthenticated: true,
        user: null,
        onClose,
        onChallengeSelect,
        ...params,
      }),
    )

  beforeEach(() => {
    challengingService = mock<ChallengingService>()
    onClose = jest.fn()
    onChallengeSelect = jest.fn()

    challengingService.fetchChallengesList.mockResolvedValue(
      createRestResponse({
        body: new PaginationResponse({
          items: [challenge],
          totalItemsCount: 40,
          itemsPerPage: 20,
          page: 1,
        }),
        statusCode: 200,
      }),
    )
    challengingService.fetchAllChallengeCategories.mockResolvedValue(
      createRestResponse({ body: [category], statusCode: 200 }),
    )
    challengingService.fetchChallengesCompletionProgress.mockResolvedValue(
      createRestResponse({
        body: {
          completedChallengesCount: 3,
          totalChallengesCount: 10,
        },
        statusCode: 200,
      }),
    )
  })

  it('should fetch sidebar data only when it is opened', async () => {
    const initialProps: Params = {
      isOpen: false,
      currentChallengeSlug: 'current-challenge',
      challengingService,
      isAccountAuthenticated: true,
      user: null,
      onClose,
      onChallengeSelect,
    }

    const { result, rerender } = renderHook(
      (props: Params) => useChallengesNavigationSidebar(props),
      { initialProps },
    )

    expect(challengingService.fetchChallengesList).not.toHaveBeenCalled()
    expect(challengingService.fetchAllChallengeCategories).not.toHaveBeenCalled()
    expect(challengingService.fetchChallengesCompletionProgress).not.toHaveBeenCalled()

    rerender({ ...initialProps, isOpen: true })

    await waitFor(() => expect(result.current.challenges).toHaveLength(1))

    expect(challengingService.fetchChallengesList).toHaveBeenCalledTimes(1)
    expect(challengingService.fetchAllChallengeCategories).toHaveBeenCalledTimes(1)
    expect(challengingService.fetchChallengesCompletionProgress).toHaveBeenCalledTimes(1)

    const params = challengingService.fetchChallengesList.mock.calls[0][0]

    expect(params.page.value).toBe(1)
    expect(params.itemsPerPage.value).toBe(20)
    expect(params.title.value).toBe('')
    expect(params.categoriesIds.dto).toEqual([])
    expect(params.difficulty.level).toBe('all')
    expect(params.completionStatus.value).toBe('all')
    expect(params.postingOrder.value).toBe('ascending')
    expect(params.shouldIncludeOnlyAuthorChallenges.value).toBe(false)
    expect(params.shouldIncludePrivateChallenges.value).toBe(false)
    expect(params.shouldIncludeStarChallenges.value).toBe(false)
  })

  it('should reset the page when searching, applying filters and clearing filters', async () => {
    const { result } = Hook()

    await waitFor(() =>
      expect(challengingService.fetchChallengesList).toHaveBeenCalledTimes(1),
    )
    await waitFor(() => expect(result.current.totalPagesCount).toBe(2))

    act(() => {
      result.current.handleNextPageClick()
    })

    await waitFor(() => expect(result.current.page).toBe(2))
    await waitFor(() =>
      expect(challengingService.fetchChallengesList).toHaveBeenCalledTimes(2),
    )

    act(() => {
      result.current.handleSearchChange('binary search')
    })

    await waitFor(() => expect(result.current.page).toBe(1))
    await waitFor(() =>
      expect(challengingService.fetchChallengesList).toHaveBeenCalledTimes(3),
    )
    expect(challengingService.fetchChallengesList.mock.calls[2][0].title.value).toBe(
      'binary search',
    )

    act(() => {
      result.current.handleNextPageClick()
    })

    await waitFor(() => expect(result.current.page).toBe(2))
    await waitFor(() =>
      expect(challengingService.fetchChallengesList).toHaveBeenCalledTimes(4),
    )

    act(() => {
      result.current.handleApplyFilters({
        completionStatus: 'completed',
        difficultyLevels: ['easy', 'hard'],
        categoriesIds: ['category-1', 'category-2'],
      })
    })

    await waitFor(() => expect(result.current.page).toBe(1))
    expect(result.current.filters).toEqual({
      completionStatus: 'completed',
      difficultyLevels: ['easy'],
      categoriesIds: ['category-1', 'category-2'],
    })

    act(() => {
      result.current.handleNextPageClick()
    })

    await waitFor(() => expect(result.current.page).toBe(2))

    act(() => {
      result.current.handleClearFilters()
    })

    await waitFor(() => expect(result.current.page).toBe(1))
    expect(result.current.filters).toEqual({
      completionStatus: 'all',
      difficultyLevels: [],
      categoriesIds: [],
    })
  })

  it('should transition to error state when loading fails', async () => {
    challengingService.fetchChallengesList.mockResolvedValueOnce(
      createRestResponse({ statusCode: 500, errorMessage: 'unexpected failure' }),
    )

    const { result } = Hook()

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(
        'Nao foi possivel carregar os desafios da barra lateral.',
      )
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isEmpty).toBe(false)
  })

  it('should navigate to previous and next pages within the available bounds', async () => {
    const { result } = Hook()

    await waitFor(() =>
      expect(challengingService.fetchChallengesList).toHaveBeenCalledTimes(1),
    )
    await waitFor(() => expect(result.current.totalPagesCount).toBe(2))

    act(() => {
      result.current.handlePreviousPageClick()
    })

    expect(result.current.page).toBe(1)
    expect(challengingService.fetchChallengesList).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.handleNextPageClick()
    })

    await waitFor(() => expect(result.current.page).toBe(2))
    await waitFor(() =>
      expect(challengingService.fetchChallengesList).toHaveBeenCalledTimes(2),
    )

    act(() => {
      result.current.handleNextPageClick()
    })

    expect(result.current.page).toBe(2)
    expect(challengingService.fetchChallengesList).toHaveBeenCalledTimes(2)

    act(() => {
      result.current.handlePreviousPageClick()
    })

    await waitFor(() => expect(result.current.page).toBe(1))
    await waitFor(() =>
      expect(challengingService.fetchChallengesList).toHaveBeenCalledTimes(3),
    )
  })

  it('should close the sidebar before selecting the clicked challenge', async () => {
    const { result } = Hook()

    await waitFor(() =>
      expect(challengingService.fetchChallengesList).toHaveBeenCalledTimes(1),
    )

    act(() => {
      result.current.handleChallengeClick('next-challenge')
    })

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onChallengeSelect).toHaveBeenCalledWith('next-challenge')
    expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(
      onChallengeSelect.mock.invocationCallOrder[0],
    )
  })
})
