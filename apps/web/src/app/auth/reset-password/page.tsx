import { COOKIES } from '@/constants'
import { cookieActions } from '@/rpc/next-safe-action'
import { ResetPasswordPage } from '@/ui/auth/widgets/pages/ResetPassword'

const Page = async () => {
  const response = await cookieActions.getCookie(COOKIES.shouldResetPassword.key)
  const canResetPassword = Boolean(response?.data)
  return <ResetPasswordPage canResetPassword={canResetPassword} />
}

export default Page
