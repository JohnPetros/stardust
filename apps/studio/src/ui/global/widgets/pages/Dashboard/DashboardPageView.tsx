import { Kpis } from './Kpis'
import { DailyActiveUsersChart } from './DailyActiveUsersChart'

export const DashboardPageView = () => {
  return (
    <div className='p-6'>
      <Kpis />
    <div className='mt-6'>
      <DailyActiveUsersChart />
    </div>
    </div>
  )
}
