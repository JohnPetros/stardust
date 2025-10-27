import type { Route } from '../+types/root'

import { PlanetsPage } from '@/ui/space/widgets/pages/Planets'
import { RestMiddleware } from '../middlewares/RestMiddleware'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { restContext } from '../contexts/RestContext'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context }: Route.LoaderArgs) => {
  const { spaceService } = context.get(restContext)
  const response = await spaceService.fetchPlanets()

  return {
    planetsDto: response.body,
  }
}

const PlanetsRoute = () => {
  return <PlanetsPage />
}

export default PlanetsRoute
