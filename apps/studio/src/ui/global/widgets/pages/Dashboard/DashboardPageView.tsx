import type { Kpi } from '@stardust/core/global/structures'

import { KpiCard } from './KpiCard'

type Props = {
  postedChallengesKpi: Kpi
  completedChallengesKpi: Kpi
  createdUsersKpi: Kpi
  unlockedStarsKpi: Kpi
}

export const DashboardPageView = ({ postedChallengesKpi, completedChallengesKpi, createdUsersKpi, unlockedStarsKpi }: Props) => {
  return (
    <div className='p-6'>
      <div className='grid grid-cols-4 gap-4 mt-3'>
        <KpiCard title='Usuários criados' kpi={createdUsersKpi} />
        <KpiCard title='Desafios publicados' kpi={postedChallengesKpi} />
        <KpiCard title='Desafios completados' kpi={completedChallengesKpi} />
        <KpiCard title='Estrelas desbloqueadas' kpi={unlockedStarsKpi} />
      </div>
    </div>
  )
}
