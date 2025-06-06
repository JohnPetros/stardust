import { Id } from '@stardust/core/global/structures'

import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ProfileService } from '@/rest/services'
import { UnlockedAchievementsListView } from './UnlockedAchievementsListView'

type Props = {
  userId: string
}

export const UnlockedAchievementsList = async ({ userId }: Props) => {
  const restClient = await NextServerRestClient()
  const achievementsService = ProfileService(restClient)
  const response = await achievementsService.fetchUnlockedAchievements(Id.create(userId))
  if (response.isFailure) response.throwError()
  const unlockedAchievements = response.body

  return <UnlockedAchievementsListView unlockedAchievements={unlockedAchievements} />
}
