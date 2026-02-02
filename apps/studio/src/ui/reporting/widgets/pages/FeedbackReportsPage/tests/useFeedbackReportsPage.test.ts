import { renderHook, act, waitFor } from '@testing-library/react'
import { mock, type Mock } from 'ts-jest-mocker'
import { useFeedbackReportsPage } from '../useFeedbackReportsPage'
import type { ReportingService } from '@stardust/core/reporting/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import { FeedbackReportsFaker } from '@stardust/core/reporting/entities/fakers'
import type { FeedbackReport } from '@stardust/core/reporting/entities'
import { RestResponse } from '@stardust/core/global/responses'

// Mocks
const mockPaginatedFetchReturn = {
  data: [] as FeedbackReport[],
  isFetching: false,
  totalItemsCount: 0,
  refetch: jest.fn(),
}

const mockQueryStringParams: Record<string, [string, jest.Mock]> = {
  author: ['', jest.fn()],
  intent: ['all', jest.fn()],
  startDate: ['', jest.fn()],
  endDate: ['', jest.fn()],
}

const mockQueryNumberParams: Record<string, [number, jest.Mock]> = {
  page: [1, jest.fn()],
  limit: [10, jest.fn()],
}

jest.mock('@/ui/global/hooks/usePaginatedFetch', () => ({
  usePaginatedFetch: jest.fn(() => mockPaginatedFetchReturn),
}))

jest.mock('@/ui/global/hooks/useQueryStringParam', () => ({
  useQueryStringParam: jest.fn((key: string, defaultValue: string) => {
    return mockQueryStringParams[key] || [defaultValue, jest.fn()]
  }),
}))

jest.mock('@/ui/global/hooks/useQueryNumberParam', () => ({
  useQueryNumberParam: jest.fn((key: string, defaultValue: number) => {
    return mockQueryNumberParams[key] || [defaultValue, jest.fn()]
  }),
}))

jest.mock('@/ui/global/hooks/useDebounce', () => ({
  useDebounce: jest.fn((value: string) => value),
}))

describe('useFeedbackReportsPage', () => {
  let reportingService: Mock<ReportingService>
  let toastProvider: Mock<ToastProvider>
  const { usePaginatedFetch } = jest.requireMock('@/ui/global/hooks/usePaginatedFetch')

  beforeEach(() => {
    jest.clearAllMocks()

    reportingService = mock<ReportingService>()
    toastProvider = mock<ToastProvider>()

    // Setup toastProvider method mocks explicitly
    toastProvider.showSuccess = jest.fn()
    toastProvider.showError = jest.fn()

    // Reset mock return values
    mockPaginatedFetchReturn.data = []
    mockPaginatedFetchReturn.isFetching = false
    mockPaginatedFetchReturn.totalItemsCount = 0
    mockPaginatedFetchReturn.refetch = jest.fn()

    // Reset query params
    mockQueryStringParams.author = ['', jest.fn()]
    mockQueryStringParams.intent = ['all', jest.fn()]
    mockQueryStringParams.startDate = ['', jest.fn()]
    mockQueryStringParams.endDate = ['', jest.fn()]
    mockQueryNumberParams.page = [1, jest.fn()]
    mockQueryNumberParams.limit = [10, jest.fn()]
  })

  it('should return initial state with empty reports', () => {
    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    expect(result.current.reports).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.totalItemsCount).toBe(0)
    expect(result.current.totalPages).toBe(0)
    expect(result.current.filters.page).toBe(1)
    expect(result.current.filters.itemsPerPage).toBe(10)
    expect(result.current.selectedReport).toBeNull()
    expect(result.current.reportToDelete).toBeNull()
    expect(result.current.isDeleting).toBe(false)
  })

  it('should handle author name change and reset page', () => {
    const setPageMock = jest.fn()
    const setAuthorNameMock = jest.fn()
    mockQueryNumberParams.page = [1, setPageMock]
    mockQueryStringParams.author = ['', setAuthorNameMock]

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    act(() => {
      result.current.handleAuthorNameChange('John Doe')
    })

    expect(setAuthorNameMock).toHaveBeenCalledWith('John Doe')
    expect(setPageMock).toHaveBeenCalledWith(1)
  })

  it('should handle intent change and reset page', () => {
    const setPageMock = jest.fn()
    const setIntentMock = jest.fn()
    mockQueryNumberParams.page = [1, setPageMock]
    mockQueryStringParams.intent = ['all', setIntentMock]

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    act(() => {
      result.current.handleIntentChange('bug')
    })

    expect(setIntentMock).toHaveBeenCalledWith('bug')
    expect(setPageMock).toHaveBeenCalledWith(1)
  })

  it('should handle creation period change and reset page', () => {
    const setPageMock = jest.fn()
    const setStartDateMock = jest.fn()
    const setEndDateMock = jest.fn()
    mockQueryNumberParams.page = [1, setPageMock]
    mockQueryStringParams.startDate = ['', setStartDateMock]
    mockQueryStringParams.endDate = ['', setEndDateMock]

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-31')

    act(() => {
      result.current.handleCreationPeriodChange({ startDate, endDate })
    })

    expect(setStartDateMock).toHaveBeenCalledWith('2024-01-01')
    expect(setEndDateMock).toHaveBeenCalledWith('2024-01-31')
    expect(setPageMock).toHaveBeenCalledWith(1)
  })

  it('should handle pagination navigation', () => {
    let currentPage = 1
    const setPageMock = jest.fn((newPage: number) => {
      currentPage = newPage
    })
    mockQueryNumberParams.page = [currentPage, setPageMock]
    mockPaginatedFetchReturn.totalItemsCount = 25

    const { result, rerender } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    // Test next page
    act(() => {
      result.current.handleNextPage()
    })
    expect(setPageMock).toHaveBeenCalledWith(2)

    // Simulate page change by updating the mock
    mockQueryNumberParams.page = [2, setPageMock]
    rerender()

    // Test previous page
    act(() => {
      result.current.handlePrevPage()
    })
    expect(setPageMock).toHaveBeenCalledWith(1)
  })

  it('should handle page change directly', () => {
    const setPageMock = jest.fn()
    mockQueryNumberParams.page = [1, setPageMock]

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    act(() => {
      result.current.handlePageChange(5)
    })

    expect(setPageMock).toHaveBeenCalledWith(5)
  })

  it('should handle items per page change and reset page', () => {
    const setPageMock = jest.fn()
    const setItemsPerPageMock = jest.fn()
    mockQueryNumberParams.page = [2, setPageMock]
    mockQueryNumberParams.limit = [10, setItemsPerPageMock]

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    act(() => {
      result.current.handleItemsPerPageChange(25)
    })

    expect(setItemsPerPageMock).toHaveBeenCalledWith(25)
    expect(setPageMock).toHaveBeenCalledWith(1)
  })

  it('should handle view report', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    act(() => {
      result.current.handleViewReport(fakeReport)
    })

    expect(result.current.selectedReport).toEqual(fakeReport)
  })

  it('should handle close report dialog', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    // First set a report
    act(() => {
      result.current.handleViewReport(fakeReport)
    })
    expect(result.current.selectedReport).toEqual(fakeReport)

    // Then close it
    act(() => {
      result.current.handleCloseReportDialog()
    })
    expect(result.current.selectedReport).toBeNull()
  })

  it('should handle open delete dialog', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    act(() => {
      result.current.handleOpenDeleteDialog(fakeReport)
    })

    expect(result.current.reportToDelete).toEqual(fakeReport)
  })

  it('should handle close delete dialog', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    // First set a report to delete
    act(() => {
      result.current.handleOpenDeleteDialog(fakeReport)
    })
    expect(result.current.reportToDelete).toEqual(fakeReport)

    // Then close it
    act(() => {
      result.current.handleCloseDeleteDialog()
    })
    expect(result.current.reportToDelete).toBeNull()
  })

  it('should handle confirm delete successfully', async () => {
    const fakeReport = FeedbackReportsFaker.fake()
    const refetchMock = jest.fn()
    mockPaginatedFetchReturn.refetch = refetchMock

    reportingService.deleteFeedbackReport.mockResolvedValue(
      new RestResponse({ statusCode: 200 }),
    )

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    // Set report to delete
    act(() => {
      result.current.handleOpenDeleteDialog(fakeReport)
    })

    // Confirm delete
    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    expect(reportingService.deleteFeedbackReport).toHaveBeenCalledWith(
      expect.objectContaining({
        value: fakeReport.id.value,
      }),
    )
    expect(toastProvider.showSuccess).toHaveBeenCalledWith(
      'Feedback deletado com sucesso',
    )
    expect(refetchMock).toHaveBeenCalled()
    expect(result.current.reportToDelete).toBeNull()
    expect(result.current.isDeleting).toBe(false)
  })

  it('should handle delete error', async () => {
    const fakeReport = FeedbackReportsFaker.fake()
    const errorMessage = 'Failed to delete'

    reportingService.deleteFeedbackReport.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage }),
    )

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    // Set report to delete
    act(() => {
      result.current.handleOpenDeleteDialog(fakeReport)
    })

    // Confirm delete
    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    expect(toastProvider.showError).toHaveBeenCalledWith(errorMessage)
    expect(result.current.reportToDelete).not.toBeNull()
    expect(result.current.isDeleting).toBe(false)
  })

  it('should close selected report when deleted report matches', async () => {
    const fakeReport = FeedbackReportsFaker.fake()
    const refetchMock = jest.fn()
    mockPaginatedFetchReturn.refetch = refetchMock

    reportingService.deleteFeedbackReport.mockResolvedValue(
      new RestResponse({ statusCode: 200 }),
    )

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    // Set report as both selected and to delete
    act(() => {
      result.current.handleViewReport(fakeReport)
      result.current.handleOpenDeleteDialog(fakeReport)
    })

    expect(result.current.selectedReport).toEqual(fakeReport)
    expect(result.current.reportToDelete).toEqual(fakeReport)

    // Confirm delete
    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    expect(result.current.selectedReport).toBeNull()
    expect(result.current.reportToDelete).toBeNull()
  })

  it('should calculate total pages correctly', () => {
    mockPaginatedFetchReturn.totalItemsCount = 25
    mockQueryNumberParams.limit = [10, jest.fn()]

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    expect(result.current.totalPages).toBe(3)
  })

  it('should be loading when fetching or deleting', () => {
    mockPaginatedFetchReturn.isFetching = true

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    expect(result.current.isLoading).toBe(true)
  })

  it('should return reports from paginated fetch data', () => {
    const fakeReportsDto = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        content: 'Test content 1',
        intent: 'bug',
        author: {
          id: '550e8400-e29b-41d4-a716-446655440001',
          entity: {
            name: 'John Doe',
            slug: 'john-doe',
            avatar: {
              name: 'John Doe',
              image: 'https://example.com/avatar.jpg',
            },
          },
        },
        sentAt: new Date().toISOString(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        content: 'Test content 2',
        intent: 'idea',
        author: {
          id: '550e8400-e29b-41d4-a716-446655440003',
          entity: {
            name: 'Jane Smith',
            slug: 'jane-smith',
            avatar: {
              name: 'Jane Smith',
              image: 'https://example.com/avatar2.jpg',
            },
          },
        },
        sentAt: new Date().toISOString(),
      },
    ]
    mockPaginatedFetchReturn.data = fakeReportsDto as any

    const { result } = renderHook(() =>
      useFeedbackReportsPage({ reportingService, toastProvider }),
    )

    expect(result.current.reports).toHaveLength(2)
    expect(result.current.reports[0].id.value).toBe(
      '550e8400-e29b-41d4-a716-446655440000',
    )
    expect(result.current.reports[0].content.value).toBe('Test content 1')
  })
})
