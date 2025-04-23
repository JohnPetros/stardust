import type { ReactNode } from 'react'

import type { AchievementDto } from '@stardust/core/profile/dtos'

import { ROUTES } from '@/constants'
import { NextApiClient } from '@/rest/next/NextApiClient'
import { SidebarProvider } from '@/ui/profile/contexts/SidebarContext'
import { HomeLayout } from '@/ui/profile/widgets/layouts/Home'
import { AchivementsProvider } from '@/ui/profile/contexts/AchievementsContext'

type HomeProps = {
  children: ReactNode
}

export default async function Home({ children }: HomeProps) {
  const apiClient = NextApiClient({ isCacheEnable: true })
  const response = await apiClient.get<AchievementDto[]>(ROUTES.api.profile.achievements)
  if (response.isFailure) response.throwError()

  return (
    <AchivementsProvider achievementsDto={response.body}>
      <SidebarProvider>
        <HomeLayout>{children}</HomeLayout>
      </SidebarProvider>
    </AchivementsProvider>
  )
}
