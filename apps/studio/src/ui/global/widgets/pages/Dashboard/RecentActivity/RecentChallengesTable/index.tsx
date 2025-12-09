import { useRest } from '@/ui/global/hooks/useRest'
import { RecentChallengesTableView } from './RecentChallengesTableView'
import { useRecentChallengesTable } from './useRecentChallengesTable'

export const RecentChallengesTable = () => {
  const { challengingService } = useRest()
  const { challenges, isLoading } = useRecentChallengesTable(challengingService)

  return <RecentChallengesTableView challenges={challenges} isLoading={isLoading} />
}
