import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next'

import { STARDUST_METADATA } from '@/constants/stardust-metadata'
import { FeedbackLayout } from '@/ui/reporting/widgets/layouts/FeedbackLayout'

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

const Layout = async ({ children }: PropsWithChildren) => {
  return <FeedbackLayout>{children}</FeedbackLayout>
}

export default Layout
