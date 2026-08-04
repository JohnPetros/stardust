import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import type { ReportingService } from '@stardust/core/reporting/interfaces'
import type {
  FeedbackReportDto,
  FeedbackReportsPageDto,
} from '@stardust/core/reporting/entities/dtos'
import { FeedbackReport } from '@stardust/core/reporting/entities'
import { FeedbackIntent, FeedbackReportStatus } from '@stardust/core/reporting/structures'
import { OrdinalNumber, Period, Text } from '@stardust/core/global/structures'

export type FeedbackReportsFilters = {
  page: number
  itemsPerPage: number
  search: string
  intent: string
  status: string
  startDate?: Date
  endDate?: Date
}
type Params = { reportingService: ReportingService }

export function useFeedbackReportsPage({ reportingService }: Params) {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { feedbackReportId } = useParams()
  const [result, setResult] = useState<FeedbackReportsPageDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    feedbackReportId ?? null,
  )

  const filters = useMemo<FeedbackReportsFilters>(() => {
    const safeNumber = (value: string | null, fallback: number) => {
      const parsed = Number(value)
      return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
    }
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    return {
      page: safeNumber(searchParams.get('page'), 1),
      itemsPerPage: safeNumber(searchParams.get('limit'), 10),
      search: searchParams.get('search') ?? '',
      intent: searchParams.get('intent') ?? 'all',
      status: searchParams.get('status') ?? 'all',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    }
  }, [searchParams])

  const fetchReports = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const response = await reportingService.listFeedbackReports({
      page: OrdinalNumber.create(filters.page),
      itemsPerPage: OrdinalNumber.create(filters.itemsPerPage),
      search: filters.search ? Text.create(filters.search) : undefined,
      intent:
        filters.intent !== 'all' ? FeedbackIntent.create(filters.intent) : undefined,
      status:
        filters.status !== 'all'
          ? FeedbackReportStatus.create(filters.status)
          : undefined,
      createdAtPeriod:
        filters.startDate && filters.endDate
          ? Period.create(filters.startDate.toISOString(), filters.endDate.toISOString())
          : undefined,
    })
    if (response.isFailure) {
      setError(response.errorMessage)
      setIsLoading(false)
      return
    }
    setResult(response.body)
    setIsLoading(false)
  }, [filters, reportingService])

  useEffect(() => {
    void fetchReports()
  }, [fetchReports])
  useEffect(() => {
    if (feedbackReportId) setSelectedReportId(feedbackReportId)
  }, [feedbackReportId])

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    value && value !== 'all' ? next.set(key, value) : next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }
  const closeDialog = () => {
    setSelectedReportId(null)
    if (location.pathname.includes('/reporting/feedback/'))
      navigate('/reporting/feedback')
  }
  const openDialog = (id: string) => {
    setSelectedReportId(id)
    navigate(`/reporting/feedback/${id}`)
  }
  const clearFilters = () => setSearchParams(new URLSearchParams())
  const reports =
    result?.items.map((dto: FeedbackReportDto) => FeedbackReport.create(dto)) ?? []
  const total = result?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / filters.itemsPerPage))

  return {
    reports,
    summary: result?.summary ?? { total: 0, open: 0, closed: 0, unread: 0 },
    isLoading,
    error,
    filters,
    totalItemsCount: total,
    totalPages,
    selectedReportId,
    refetch: fetchReports,
    setSearch: (value: string) => setFilter('search', value),
    setIntent: (value: string) => setFilter('intent', value),
    setStatus: (value: string) => setFilter('status', value),
    setPeriod: (period: { startDate?: Date; endDate?: Date }) => {
      const next = new URLSearchParams(searchParams)
      period.startDate
        ? next.set('startDate', period.startDate.toISOString().slice(0, 10))
        : next.delete('startDate')
      period.endDate
        ? next.set('endDate', period.endDate.toISOString().slice(0, 10))
        : next.delete('endDate')
      next.set('page', '1')
      setSearchParams(next)
    },
    setPage: (page: number) => {
      const next = new URLSearchParams(searchParams)
      next.set('page', String(Math.min(Math.max(1, page), totalPages)))
      setSearchParams(next)
    },
    setItemsPerPage: (count: number) => {
      const next = new URLSearchParams(searchParams)
      next.set('limit', String(count))
      next.set('page', '1')
      setSearchParams(next)
    },
    openDialog,
    closeDialog,
    clearFilters,
  }
}
