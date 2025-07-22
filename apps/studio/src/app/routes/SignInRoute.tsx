import { SignInPage } from '@/ui/auth/widgets/pages/SignIn'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'

export const unstable_clientMiddleware = [AuthMiddleware]

const SignInRoute = () => {
  return <SignInPage />
}

export default SignInRoute
