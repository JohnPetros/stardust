import type { ReactNode } from 'react'

import type { AchievementDTO } from '@/@core/dtos'

import { AchivementsProvider } from '@/modules/app/contexts/AchievementsContext'
import { NextClient } from '@/server/client'
import { ROUTES } from '@/modules/global/constants'

type AppProps = {
  children: ReactNode
}

export default async function App({ children }: AppProps) {
  const client = NextClient()

  const achievementsDTO = await client.get<AchievementDTO[]>(ROUTES.server.achievements)

  return (
    <AchivementsProvider achievementsDTO={achievementsDTO}>
      {children}
    </AchivementsProvider>
  )
}
