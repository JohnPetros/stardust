import { FeedbackReportDetailPage } from '@/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackReportDetailPage'
import { AuthMiddleware, RestMiddleware } from '../middlewares'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

export default FeedbackReportDetailPage
