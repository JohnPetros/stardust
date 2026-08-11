import { useMemo } from 'react'
import { Datetime } from '@stardust/core/global/libs'
import type { FeedbackReportDto } from '@stardust/core/reporting/entities/dtos'

import type { FeedbackFilter } from '@/ui/reporting/types'

export const feedbackHistoryFilters: Array<{ value: FeedbackFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'open', label: 'Abertos' },
  { value: 'closed', label: 'Fechados' },
]

type IntentMeta = {
  label: string
  icon: 'bug' | 'lightbulb' | 'comment'
  color: string
  bg: string
}

const otherIntentMeta: IntentMeta = {
  label: 'Outro',
  icon: 'comment',
  color: 'text-blue-300',
  bg: 'bg-blue-400/10',
}

const reportIntentMeta: Record<string, IntentMeta> = {
  bug: {
    label: 'Problema',
    icon: 'bug',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  idea: {
    label: 'Ideia',
    icon: 'lightbulb',
    color: 'text-yellow-300',
    bg: 'bg-yellow-400/10',
  },
  other: otherIntentMeta,
}

export type FeedbackReportHistoryItem = {
  report: FeedbackReportDto
  meta: IntentMeta
  dateLabel: string
}

type Params = { reports: FeedbackReportDto[] }

export function useFeedbackReportsHistory({ reports }: Params) {
  const items: FeedbackReportHistoryItem[] = useMemo(
    () =>
      reports.map((report) => {
        const activityDate = report.lastActivityAt ?? report.createdAt
        return {
          report,
          meta: reportIntentMeta[report.intent] ?? otherIntentMeta,
          dateLabel: activityDate
            ? new Datetime(activityDate).format('DD/MM/YYYY')
            : 'sem data',
        }
      }),
    [reports],
  )

  return { filters: feedbackHistoryFilters, items }
}
