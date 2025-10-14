import { AchievementsPage } from '@/ui/global/widgets/pages/Achievements'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

const AchievementsRoute = () => {
  return <AchievementsPage />
}

export default AchievementsRoute
