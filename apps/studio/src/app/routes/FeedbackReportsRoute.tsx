import { FeedbackReportsPage } from '@/ui/reporting/widgets/pages/FeedbackReportsPage'
import { AuthMiddleware, RestMiddleware } from '../middlewares'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

const FeedbackReportsRoute = () => {
  return <FeedbackReportsPage />
}

export default FeedbackReportsRoute
