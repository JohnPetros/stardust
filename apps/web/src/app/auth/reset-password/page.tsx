import type { Metadata } from 'next'

import { COOKIES } from '@/constants'
import { STARDUST_METADATA } from '@/constants/stardust-metadata'
import { cookieActions } from '@/rpc/next-safe-action'
import { ResetPasswordPage } from '@/ui/auth/widgets/pages/ResetPassword'

export const metadata: Metadata = {
  ...STARDUST_METADATA,
  robots: {
    index: false,
    follow: false,
    nocache: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

const Page = async () => {
  const response = await cookieActions.getCookie(COOKIES.shouldResetPassword.key)
  const canResetPassword = Boolean(response?.data)
  return <ResetPasswordPage canResetPassword={canResetPassword} />
}

export default Page
