import { useRest } from '@/ui/global/hooks/useRest'
import { DailyActiveUsersChartView } from './DailyActiveUsersChartView'
import { useDailyActiveUsersChart } from './useDailyActiveUsersChart'

export const DailyActiveUsersChart = () => {
  const { profileService } = useRest()
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
