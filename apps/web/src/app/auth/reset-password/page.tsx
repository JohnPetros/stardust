import { cookieActions } from '@/rpc/next-safe-action'
import { COOKIES } from '@/constants'
import { ResetPasswordPage } from '@/ui/auth/widgets/pages/ResetPassword'

export default async function Page() {
  const response = await cookieActions.getCookie(COOKIES.keys.shouldResetPassword)
  const canResetPassword = Boolean(response?.data)
  return <ResetPasswordPage canResetPassword={canResetPassword} />
}
