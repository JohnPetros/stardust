import { InsigniasPage } from '@/ui/shop/widgets/pages/InsigniasPage'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

const InsigniasRoute = () => {
  return <InsigniasPage />
}

export default InsigniasRoute
