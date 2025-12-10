import type { Route } from '../+types/root'

import { AchievementsPage } from '@/ui/profile/widgets/pages/AchievementsPage'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'
import { restContext } from '../contexts/RestContext'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context }: Route.LoaderArgs) => {
  const { profileService } = context.get(restContext)
  const response = await profileService.fetchAllAchievements()

  if (response.isFailure) {
    response.throwError()
  }

  return {
    achievementsDto: response.body,
  }
}

const AchievementsRoute = () => {
  return <AchievementsPage />
}

export default AchievementsRoute
