import { Outlet } from 'react-router'

import { AppLayout as Layout } from '@/ui/global/widgets/layouts/App'
import { AuthMiddleware, RestMiddleware } from '../middlewares'
import type { Route } from '../+types/root'
import { restContext } from '../contexts/RestContext'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context }: Route.LoaderArgs) => {
  const { authService } = context.get(restContext)
  const response = await authService.fetchAccount()
  if (response.isFailure) response.throwError()

  const account = response.body

  return {
    account,
  }
}

const AppLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default AppLayout
