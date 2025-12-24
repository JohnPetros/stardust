import { AvatarsPage } from '@/ui/shop/widgets/pages/AvatarsPage'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

const AvatarsRoute = () => {
  return <AvatarsPage />
}

export default AvatarsRoute
