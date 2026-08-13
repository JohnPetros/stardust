import { FeedbackReportsHistoryView } from './FeedbackReportsHistoryView'
import { useFeedbackReportsHistory } from './useFeedbackReportsHistory'
import type { FeedbackFilter, FeedbackRequestState } from '@/ui/reporting/types'
import type { FeedbackReportDto } from '@stardust/core/reporting/entities/dtos'

type Props = {
  reports: FeedbackReportDto[]
  filter: FeedbackFilter
  state: FeedbackRequestState
  onFilterChange: (filter: FeedbackFilter) => void
  onSelect: (id: string) => void
  onLoadMore: () => void
  hasMore: boolean
  onRetry: () => void
}

export function FeedbackReportsHistory({ reports, ...props }: Props) {
  const { items, filters } = useFeedbackReportsHistory({ reports })
  return <FeedbackReportsHistoryView {...props} items={items} filters={filters} />
}
