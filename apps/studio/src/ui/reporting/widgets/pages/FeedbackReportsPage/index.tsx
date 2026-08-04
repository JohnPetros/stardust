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
    selectedReportId,
    setSearch,
    setIntent,
    setStatus,
    setPeriod,
    openDialog,
    closeDialog,
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
      selectedReportId={selectedReportId}
      onSearch={setSearch}
      onIntent={setIntent}
      onStatus={setStatus}
      onPeriod={setPeriod}
      onView={(report) => openDialog(report.id.value)}
      onClose={closeDialog}
      onClearFilters={clearFilters}
      onRetry={refetch}
      onPage={setPage}
      onItemsPerPage={setItemsPerPage}
    />
  )
}
