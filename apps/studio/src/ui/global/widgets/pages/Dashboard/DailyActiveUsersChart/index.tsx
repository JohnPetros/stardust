import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { DailyActiveUsersChartView } from './DailyActiveUsersChartView'
import { useDailyActiveUsersChart } from './useDailyActiveUsersChart'

export const DailyActiveUsersChart = () => {
  const { profileService } = useRestContext()
  const { dailyActiveUsers, days, isLoading, handleDaysSelectChange } =
    useDailyActiveUsersChart(profileService)

  return (
    <DailyActiveUsersChartView
      data={dailyActiveUsers}
      days={days}
      isLoading={isLoading}
      handleDaysSelectChange={handleDaysSelectChange}
    />
  )
}
