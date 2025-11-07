import type { Metadata } from 'next'

import { SocialAccountConfirmationPage } from '@/ui/auth/widgets/pages/SocialAccountConfirmation'
import { STARDUST_METADATA } from '@/constants/stardust-metadata'

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

export default SocialAccountConfirmationPage
