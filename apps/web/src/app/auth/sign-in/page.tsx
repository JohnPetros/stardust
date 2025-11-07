import type { Metadata } from 'next'

import { SignInPage } from '@/ui/auth/widgets/pages/SignIn'
import { STARDUST_METADATA } from '@/constants/stardust-metadata'

export const metadata: Metadata = {
  ...STARDUST_METADATA,
  robots: {
    index: true,
    follow: false,
    nocache: false,
    googleBot: {
      index: true,
      follow: false,
    },
  },
}

const Page = () => {
  return <SignInPage />
}

export default Page
