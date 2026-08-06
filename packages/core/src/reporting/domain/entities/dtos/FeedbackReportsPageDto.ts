import type { FeedbackReportDto } from './FeedbackReportDto'

export type FeedbackReportsPageDto = {
  items: FeedbackReportDto[]
  page: number
  itemsPerPage: number
  total: number
  summary: { total: number; open: number; closed: number; unread: number }
}
