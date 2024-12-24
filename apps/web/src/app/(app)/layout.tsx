import type { ReactNode } from 'react'

import type { AchievementDto } from '@stardust/core/profile/dtos'

import { NextApiClient } from '@/api/next/NextApiClient'
import { ROUTES } from '@/constants'
import { AchivementsProvider } from '@/ui/profile/contexts/AchievementsContext'
import { AudioProvider } from '@/ui/global/contexts/AudioContext'
import { EditorProvider } from '@/ui/global/contexts/EditorContext'

type AppProps = {
  children: ReactNode
}

export default async function App({ children }: AppProps) {
  const apiClient = NextApiClient({ isCacheEnable: true })
  const response = await apiClient.get<AchievementDto[]>(ROUTES.api.profile.achievements)
  if (response.isFailure) response.throwError()

  return (
    <AudioProvider>
      <AchivementsProvider achievementsDto={response.body}>
        <EditorProvider>{children}</EditorProvider>
      </AchivementsProvider>
    </AudioProvider>
  )
}
