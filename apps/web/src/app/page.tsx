import type { Metadata } from 'next'

import { STARDUST_METADATA } from '@/constants/stardust-metadata'
import { LandingPage } from '@/ui/global/widgets/pages/Landing'

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

const Page = async () => {
  return <LandingPage />
}

export default Page
