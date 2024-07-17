import type { ReactNode } from 'react'

import type { AchievementDTO } from '@/@core/dtos'

import { AchivementsProvider } from '@/modules/app/contexts/AchievementsContext'
import { NextClient } from '@/server/client'
import { ROUTES } from '@/modules/global/constants'
import { AppError } from '@/@core/errors/global/AppError'

type AppProps = {
  children: ReactNode
}

export default async function App({ children }: AppProps) {
  const client = NextClient()

  const response = await client.get<AchievementDTO[]>(ROUTES.server.achievements)

  if (response.isError) throw new AppError(response.errorMessage)

  return (
    <AchivementsProvider achievementsDTO={response.body}>{children}</AchivementsProvider>
  )
}
