import type { ReactNode } from 'react'

import type { AchievementDto } from '#dtos'
import { AppError } from '@stardust/core/global/errors'

import { NextApiClient } from '@/api/next/NextApiClient'
import { ROUTES } from '@/constants'
import { AchivementsProvider } from '@/ui/profile/contexts/AchievementsContext'
import { AudioProvider } from '@/ui/global/contexts/AudioContext'
import { EditorProvider } from '@/ui/global/contexts/EditorContext'

type AppProps = {
  children: ReactNode
}

export default async function App({ children }: AppProps) {
  const apiClient = NextApiClient()

  const response = await apiClient.get<AchievementDto[]>(ROUTES.api.achievements)

  if (response.isFailure) throw new AppError(response.errorMessage)

  return (
    <AudioProvider>
      <AchivementsProvider achievementsDto={response.body}>
        <EditorProvider>{children}</EditorProvider>
      </AchivementsProvider>
    </AudioProvider>
  )
}
