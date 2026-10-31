import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { FeedbackReportsPageView } from './FeedbackReportsPageView'
import { useFeedbackReportsPage } from './useFeedbackReportsPage'

export const FeedbackReportsPage = () => {
  const { reportingService } = useRestContext()
  const {
    reports,
    isLoading,
    error,
    summary,
    totalItemsCount,
    totalPages,
    filters,
    setSearch,
    setIntent,
    setStatus,
    setPeriod,
    openReport,
    refetch,
    clearFilters,
    setPage,
    setItemsPerPage,
  } = useFeedbackReportsPage({ reportingService })

  return (
    <FeedbackReportsPageView
      reports={reports}
      isLoading={isLoading}
      summary={summary}
      error={error}
      totalItemsCount={totalItemsCount}
      totalPages={totalPages}
      filters={filters}
      onSearch={setSearch}
      onIntent={setIntent}
      onStatus={setStatus}
      onPeriod={setPeriod}
      onView={(report) => openReport(report.id.value)}
      onClearFilters={clearFilters}
      onRetry={refetch}
      onPage={setPage}
      onItemsPerPage={setItemsPerPage}
    />
  )
}
