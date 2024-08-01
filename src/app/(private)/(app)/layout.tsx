import type { ReactNode } from 'react'

import type { AchievementDTO } from '@/@core/dtos'
import { AppError } from '@/@core/errors/global/AppError'

import { NextApiClient } from '@/server/NextApiClient'
import { ROUTES } from '@/modules/global/constants'
import { AchivementsProvider } from '@/modules/app/contexts/AchievementsContext'
import { AudioProvider } from '@/modules/app/contexts/AudioContext'
import { EditorProvider } from '@/modules/app/contexts/EditorContext'

type AppProps = {
  children: ReactNode
}

export default async function App({ children }: AppProps) {
  const apiClient = NextApiClient()

  const response = await apiClient.get<AchievementDTO[]>(ROUTES.server.achievements)

  if (response.isError) throw new AppError(response.errorMessage)

  return (
    <AudioProvider>
      <AchivementsProvider achievementsDTO={response.body}>
        <EditorProvider>{children}</EditorProvider>
      </AchivementsProvider>
    </AudioProvider>
  )
}
