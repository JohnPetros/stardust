import { useLoaderData } from 'react-router'

import { Kpi } from '@stardust/core/global/structures'

import type { clientLoader } from '@/app/routes/DashboardRoute'
import { DashboardPageView } from './DashboardPageView'

export const DashboardPage = () => {
  const {
    postedChallengesKpiDto,
    completedChallengesKpiDto,
    createdUsersKpiDto,
    unlockedStarsKpiDto,
  } = useLoaderData<typeof clientLoader>()
  return (
    <DashboardPageView
      postedChallengesKpi={Kpi.create(postedChallengesKpiDto)}
      completedChallengesKpi={Kpi.create(completedChallengesKpiDto)}
      createdUsersKpi={Kpi.create(createdUsersKpiDto)}
      unlockedStarsKpi={Kpi.create(unlockedStarsKpiDto)}
    />
  )
}
