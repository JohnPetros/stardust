import type { ReactNode } from 'react'

import { SidebarProvider } from '@/ui/profile/contexts/SidebarContext'
import { HomeLayout } from '@/ui/profile/widgets/layouts/Home'
import { AchivementsProvider } from '@/ui/profile/contexts/AchievementsContext'
import { ProfileService } from '@/rest/services/ProfileService'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'

type HomeProps = {
  children: ReactNode
}

const Layout = async ({ children }: HomeProps) => {
  const restClient = await NextServerRestClient({ isCacheEnabled: true })
  const profileService = ProfileService(restClient)
  const response = await profileService.fetchAchievements()
  if (response.isFailure) response.throwError()

  return (
    <AchivementsProvider achievementsDto={response.body}>
      <SidebarProvider>
        <HomeLayout>{children}</HomeLayout>
      </SidebarProvider>
    </AchivementsProvider>
  )
}

export default Layout
