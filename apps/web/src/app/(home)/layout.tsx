import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next'

import { STARDUST_METADATA } from '@/constants/stardust-metadata'
import { SidebarProvider } from '@/ui/profile/contexts/SidebarContext'
import { HomeLayout } from '@/ui/profile/widgets/layouts/Home'
import { AchivementsProvider } from '@/ui/profile/contexts/AchievementsContext'
import { ProfileService } from '@/rest/services/ProfileService'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { UserCreationPendingLayout } from '@/ui/global/widgets/layouts/UserCreationPendingLayout'

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
  const restClient = await NextServerRestClient({ isCacheEnabled: true })
  const profileService = ProfileService(restClient)
  const response = await profileService.fetchAchievements()
  if (response.isFailure) response.throwError()

  return (
    <UserCreationPendingLayout>
      <AchivementsProvider achievementsDto={response.body}>
        <SidebarProvider>
          <HomeLayout>{children}</HomeLayout>
        </SidebarProvider>
      </AchivementsProvider>
    </UserCreationPendingLayout>
  )
}

export default Layout
