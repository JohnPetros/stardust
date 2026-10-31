import { Kpis } from './Kpis'
import { DailyActiveUsersChart } from './DailyActiveUsersChart'
import { RecentActivity } from './RecentActivity'

export const DashboardPageView = () => {
  return (
    <div className='p-6 pb-12 space-y-8'>
      <Kpis />
      <DailyActiveUsersChart />
      <RecentActivity />
    </div>
  )
}
