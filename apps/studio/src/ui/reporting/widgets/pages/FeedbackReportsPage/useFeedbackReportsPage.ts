import { useMemo, useState } from 'react'

import type { ReportingService } from '@stardust/core/reporting/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import { FeedbackReport } from '@stardust/core/reporting/entities'
import { OrdinalNumber, Text, Id, Period } from '@stardust/core/global/structures'
import { Datetime } from '@stardust/core/global/libs'

import { usePaginatedFetch } from '@/ui/global/hooks/usePaginatedFetch'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useQueryNumberParam } from '@/ui/global/hooks/useQueryNumberParam'
import { useDebounce } from '@/ui/global/hooks/useDebounce'
import { CACHE } from '@/constants'

export type FeedbackReportsFilters = {
  page: number
  itemsPerPage: number
  authorName: string
  intent: string
  startDate?: Date
  endDate?: Date
}

type Params = {
  reportingService: ReportingService
  toastProvider: ToastProvider
}

export function useFeedbackReportsPage({ reportingService, toastProvider }: Params) {
  const [page, setPage] = useQueryNumberParam('page', 1)
  const [itemsPerPage, setItemsPerPage] = useQueryNumberParam('limit', 10)
  const [authorName, setAuthorName] = useQueryStringParam('author', '')
  const [intent, setIntent] = useQueryStringParam('intent', 'all')
  const [startDateParam, setStartDateParam] = useQueryStringParam('startDate', '')
  const [endDateParam, setEndDateParam] = useQueryStringParam('endDate', '')
  const debouncedAuthorName = useDebounce(authorName, 500)

  const [selectedReport, setSelectedReport] = useState<FeedbackReport | null>(null)
  const [reportToDelete, setReportToDelete] = useState<FeedbackReport | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const sentAtPeriod = useMemo(() => {
    if (!startDateParam || !endDateParam) return undefined
    return Period.create(startDateParam, endDateParam)
  }, [startDateParam, endDateParam])

  const { data, isFetching, totalItemsCount, refetch } = usePaginatedFetch({
    key: CACHE.feedbackReportsTable.key,
    itemsPerPage,
    dependencies: [
      debouncedAuthorName,
      intent,
      startDateParam,
      endDateParam,
      page,
      itemsPerPage,
    ],
    fetcher: async () =>
      await reportingService.listFeedbackReports({
        page: OrdinalNumber.create(page),
        itemsPerPage: OrdinalNumber.create(itemsPerPage),
        authorName: debouncedAuthorName ? Text.create(debouncedAuthorName) : undefined,
        intent: intent === 'all' ? undefined : Text.create(intent),
        sentAtPeriod,
      }),
  })

  const totalPages = Math.ceil(totalItemsCount / itemsPerPage)

  function handleAuthorNameChange(value: string) {
    setAuthorName(value)
    setPage(1)
  }

  function handleIntentChange(value: string) {
    setIntent(value)
    setPage(1)
  }

  function handleCreationPeriodChange(period: { startDate?: Date; endDate?: Date }) {
    setStartDateParam(
      period.startDate
        ? new Datetime(period.startDate.toISOString()).format('YYYY-MM-DD')
        : '',
    )
    setEndDateParam(
      period.endDate
        ? new Datetime(period.endDate.toISOString()).format('YYYY-MM-DD')
        : '',
    )
    setPage(1)
  }

  function handleNextPage() {
    if (page < totalPages) setPage(page + 1)
  }

  function handlePrevPage() {
    if (page > 1) setPage(page - 1)
  }

  function handlePageChange(newPage: number) {
    setPage(newPage)
  }

  function handleItemsPerPageChange(count: number) {
    setItemsPerPage(count)
    setPage(1)
  }

  function handleViewReport(report: FeedbackReport) {
    setSelectedReport(report)
  }

  function handleCloseReportDialog() {
    setSelectedReport(null)
  }

  function handleOpenDeleteDialog(report: FeedbackReport) {
    setReportToDelete(report)
  }

  function handleCloseDeleteDialog() {
    setReportToDelete(null)
  }

  async function handleConfirmDelete() {
    if (!reportToDelete) return
    setIsDeleting(true)

    const response = await reportingService.deleteFeedbackReport(
      Id.create(reportToDelete.id.value),
    )

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      setIsDeleting(false)
      return
    }

    toastProvider.showSuccess('Feedback deletado com sucesso')
    setReportToDelete(null)
    if (selectedReport?.id.value === reportToDelete.id.value) {
      setSelectedReport(null)
    }
    refetch()
    setIsDeleting(false)
  }

  const filters: FeedbackReportsFilters = {
    page,
    itemsPerPage,
    authorName,
    intent,
    startDate: startDateParam ? new Date(startDateParam) : undefined,
    endDate: endDateParam ? new Date(endDateParam) : undefined,
  }

  const reports = data ? data.map(FeedbackReport.create) : []

  return {
    isLoading: isFetching || isDeleting,
    reports,
    totalItemsCount,
    totalPages,
    filters,
    selectedReport,
    reportToDelete,
    isDeleting,
    handleAuthorNameChange,
    handleIntentChange,
    handleCreationPeriodChange,
    handleNextPage,
    handlePrevPage,
    handlePageChange,
    handleItemsPerPageChange,
    handleViewReport,
    handleCloseReportDialog,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
  }
}
