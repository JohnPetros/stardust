import { ShopPage } from '@/ui/shop/widgets/pages/Shop'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

const ShopRoute = () => {
  return <ShopPage />
}

export default ShopRoute
