import { UsersPage } from '@/ui/global/widgets/pages/Users'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'

export const middleware = [AuthMiddleware, RestMiddleware]

const UsersRoute = () => {
  return <UsersPage />
}

export default UsersRoute
