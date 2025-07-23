import type { Route } from '../+types/root'
import { PlanetsPage } from '@/ui/space/widgets/pages/Planets'
import { RestMiddleware } from '../middlewares/RestMiddleware'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { restContext } from '../contexts/restContext'

export const unstable_clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context }: Route.ActionArgs) => {
  const { spaceService, storageService } = context.get(restContext)
  const response = await spaceService.fetchPlanets()

  return {
    planets: response.body.map((planet) => ({
      ...planet,
      image: storageService.fetchImage('planets', planet.image),
      icon: storageService.fetchImage('planets', planet.icon),
    })),
  }
}

const PlanetsRoute = () => {
  return <PlanetsPage />
}

export default PlanetsRoute
