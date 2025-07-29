import type { Route } from '../+types/root'
import { PlanetsPage } from '@/ui/space/widgets/pages/Planets'
import { RestMiddleware } from '../middlewares/RestMiddleware'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { restContext } from '../contexts/restContext'
import { useImage } from '@/ui/global/hooks/useImage'

export const unstable_clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context }: Route.ActionArgs) => {
  const { spaceService } = context.get(restContext)
  const response = await spaceService.fetchPlanets()

  return {
    planets: response.body.map((planet) => ({
      ...planet,
      image: useImage('planets', planet.image),
      icon: useImage('planets', planet.icon),
    })),
  }
}

const PlanetsRoute = () => {
  return <PlanetsPage />
}

export default PlanetsRoute
