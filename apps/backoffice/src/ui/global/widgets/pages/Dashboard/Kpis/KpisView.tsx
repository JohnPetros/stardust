import type { Kpi } from '@stardust/core/global/structures'

import { KpiCard } from '../KpiCard'

type Props = {
  createdUsersKpi: Kpi
  postedChallengesKpi: Kpi
  completedChallengesKpi: Kpi
  unlockedStarsKpi: Kpi
}

export const KpisView = ({
  createdUsersKpi,
  postedChallengesKpi,
  completedChallengesKpi,
  unlockedStarsKpi,
}: Props) => {
  return (
    <div className='grid grid-cols-4 gap-4 mt-3'>
      <KpiCard title='Usuários criados' kpi={createdUsersKpi} />
      <KpiCard title='Desafios publicados' kpi={postedChallengesKpi} />
      <KpiCard title='Desafios completados' kpi={completedChallengesKpi} />
      <KpiCard title='Estrelas desbloqueadas' kpi={unlockedStarsKpi} />
    </div>
  )
}
