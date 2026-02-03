import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { FeedbackReportsPageView } from './FeedbackReportsPageView'
import { useFeedbackReportsPage } from './useFeedbackReportsPage'

export const FeedbackReportsPage = () => {
  const { reportingService } = useRestContext()
  const toastProvider = useToastProvider()
  const {
    reports,
    isLoading,
    totalItemsCount,
    totalPages,
    filters,
    selectedReport,
    reportToDelete,
    isDeleting,
    handleAuthorNameChange,
    handleIntentChange,
    handleCreationPeriodChange,
    handleViewReport,
    handleOpenDeleteDialog,
    handleCloseReportDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    handleNextPage,
    handlePrevPage,
    handlePageChange,
    handleItemsPerPageChange,
  } = useFeedbackReportsPage({ reportingService, toastProvider })

  return (
    <FeedbackReportsPageView
      reports={reports}
      isLoading={isLoading}
      totalItemsCount={totalItemsCount}
      totalPages={totalPages}
      filters={filters}
      selectedReport={selectedReport}
      reportToDelete={reportToDelete}
      isDeleting={isDeleting}
      onAuthorNameChange={handleAuthorNameChange}
      onIntentChange={handleIntentChange}
      onCreationPeriodChange={handleCreationPeriodChange}
      onViewReport={handleViewReport}
      onDeleteReport={handleOpenDeleteDialog}
      onCloseReportDialog={handleCloseReportDialog}
      onCloseDeleteDialog={handleCloseDeleteDialog}
      onConfirmDelete={handleConfirmDelete}
      onNextPage={handleNextPage}
      onPrevPage={handlePrevPage}
      onPageChange={handlePageChange}
      onItemsPerPageChange={handleItemsPerPageChange}
    />
  )
}
