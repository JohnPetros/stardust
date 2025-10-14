import { SignInPage } from '@/ui/auth/widgets/pages/SignIn'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'

export const clientMiddleware = [AuthMiddleware]

const SignInRoute = () => {
  return <SignInPage />
}

export default SignInRoute
