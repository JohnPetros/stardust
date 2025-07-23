import type { Route } from '../+types/root'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { restContext } from '../contexts/restContext'
import { RestMiddleware } from '../middlewares/RestMiddleware'

export const unstable_clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context }: Route.ActionArgs) => {
  const { spaceService } = context.get(restContext)
  const response = await spaceService.fetchPlanets()

  return {
    planets: response.body,
  }
}

const PlanetsRoute = () => {
  return <h1>Planets</h1>
}

export default PlanetsRoute
