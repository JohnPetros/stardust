import type { Metadata } from 'next'

import { STARDUST_METADATA } from '@/constants/stardust-metadata'
import { AccountConfirmationPage } from '@/ui/auth/widgets/pages/AccountConfirmation'

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

export default AccountConfirmationPage
