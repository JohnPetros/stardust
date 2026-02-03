import type { FeedbackReport } from '@stardust/core/reporting/entities'

import { Input } from '@/ui/shadcn/components/input'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { PeriodPicker } from '@/ui/global/widgets/components/PeriodPicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'
import { FeedbackReportsTable } from './FeedbackReportsTable'
import { FeedbackReportDialog } from './FeedbackReportDialog'
import { DeleteFeedbackReportDialog } from './DeleteFeedbackReportDialog'
import type { FeedbackReportsFilters } from './useFeedbackReportsPage'

export type FeedbackReportsPageViewProps = {
  reports: FeedbackReport[]
  isLoading: boolean
  totalItemsCount: number
  totalPages: number
  filters: FeedbackReportsFilters
  selectedReport: FeedbackReport | null
  reportToDelete: FeedbackReport | null
  isDeleting: boolean
  onAuthorNameChange: (value: string) => void
  onIntentChange: (value: string) => void
  onCreationPeriodChange: (period: { startDate?: Date; endDate?: Date }) => void
  onViewReport: (report: FeedbackReport) => void
  onDeleteReport: (report: FeedbackReport) => void
  onCloseReportDialog: () => void
  onCloseDeleteDialog: () => void
  onConfirmDelete: () => void
  onNextPage: () => void
  onPrevPage: () => void
  onPageChange: (page: number) => void
  onItemsPerPageChange: (count: number) => void
}

export const FeedbackReportsPageView = ({
  reports,
  isLoading,
  totalItemsCount,
  totalPages,
  filters,
  selectedReport,
  reportToDelete,
  isDeleting,
  onAuthorNameChange,
  onIntentChange,
  onCreationPeriodChange,
  onViewReport,
  onDeleteReport,
  onCloseReportDialog,
  onCloseDeleteDialog,
  onConfirmDelete,
  onNextPage,
  onPrevPage,
  onPageChange,
  onItemsPerPageChange,
}: FeedbackReportsPageViewProps) => {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Relatórios de Feedback</h1>
        <p className='text-muted-foreground'>
          Visualize e gerencie os relatórios de feedback enviados pelos usuários.
        </p>
      </div>

      <div className='flex flex-wrap items-center gap-4'>
        <Input
          placeholder='Filtrar por autor...'
          value={filters.authorName}
          onChange={(event) => onAuthorNameChange(event.target.value)}
          className='max-w-xs'
        />

        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Tipo:</span>
          <Select value={filters.intent} onValueChange={onIntentChange}>
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Tipo de feedback' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todos</SelectItem>
              <SelectItem value='bug'>Bug</SelectItem>
              <SelectItem value='idea'>Ideia</SelectItem>
              <SelectItem value='other'>Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <PeriodPicker
          startDate={filters.startDate}
          endDate={filters.endDate}
          label='Período de envio'
          onChange={onCreationPeriodChange}
        />
      </div>

      <FeedbackReportsTable
        reports={reports}
        isLoading={isLoading}
        onView={onViewReport}
        onDelete={onDeleteReport}
      />

      {totalPages > 1 && (
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          totalItemsCount={totalItemsCount}
          itemsPerPage={filters.itemsPerPage}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      )}

      <FeedbackReportDialog
        report={selectedReport}
        isOpen={Boolean(selectedReport)}
        onClose={onCloseReportDialog}
        onDelete={onDeleteReport}
      />

      <DeleteFeedbackReportDialog
        report={reportToDelete}
        isOpen={Boolean(reportToDelete)}
        isDeleting={isDeleting}
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDelete}
      />
    </div>
  )
}
