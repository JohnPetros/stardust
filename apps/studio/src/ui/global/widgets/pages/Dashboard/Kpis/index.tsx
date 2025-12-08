import { useLoaderData } from 'react-router'

import { Kpi } from '@stardust/core/global/structures'

import type { clientLoader } from '@/app/routes/DashboardRoute'
import { KpisView } from './KpisView'

export const Kpis = () => {
  const {
    postedChallengesKpiDto,
    completedChallengesKpiDto,
    createdUsersKpiDto,
    unlockedStarsKpiDto,
  } = useLoaderData<typeof clientLoader>()
  return (
    <KpisView
      createdUsersKpi={Kpi.create(createdUsersKpiDto)}
      postedChallengesKpi={Kpi.create(postedChallengesKpiDto)}
      completedChallengesKpi={Kpi.create(completedChallengesKpiDto)}
      unlockedStarsKpi={Kpi.create(unlockedStarsKpiDto)}
    />
  )
}
