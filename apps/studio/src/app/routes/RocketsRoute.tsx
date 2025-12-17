import { RocketsPage } from '@/ui/shop/widgets/pages/RocketsPage'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

const RocketsRoute = () => {
  return <RocketsPage />
}

export default RocketsRoute
