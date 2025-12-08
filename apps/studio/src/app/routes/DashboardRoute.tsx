import { DashboardPage } from '@/ui/global/widgets/pages/Dashboard'
import { AuthMiddleware, RestMiddleware } from '../middlewares'
import type { Route } from '../+types/root'
import { restContext } from '../contexts/RestContext'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context }: Route.LoaderArgs) => {
  const { profileService, challengingService } = context.get(restContext)
  const [
    completedChallengesKpiResponse,
    createdUsersKpiResponse,
    unlockedStarsKpiResponse,
    postedChallengesKpiResponse,
  ] = await Promise.all([
    profileService.fetchCompletedChallengesKpi(),
    profileService.fetchCreatedUsersKpi(),
    profileService.fetchUnlockedStarsKpi(),
    challengingService.fetchPostedChallengesKpi(),
  ])
  if (completedChallengesKpiResponse.isFailure) {
    completedChallengesKpiResponse.throwError()
  }
  if (createdUsersKpiResponse.isFailure) {
    createdUsersKpiResponse.throwError()
  }
  if (unlockedStarsKpiResponse.isFailure) {
    unlockedStarsKpiResponse.throwError()
  }
  if (postedChallengesKpiResponse.isFailure) {
    postedChallengesKpiResponse.throwError()
  }

  return {
    postedChallengesKpiDto: postedChallengesKpiResponse.body,
    completedChallengesKpiDto: completedChallengesKpiResponse.body,
    createdUsersKpiDto: createdUsersKpiResponse.body,
    unlockedStarsKpiDto: unlockedStarsKpiResponse.body,
  }
}

const DashboardRoute = () => {
  return <DashboardPage />
}

export default DashboardRoute
