import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { RecentChallengesTableView } from './RecentChallengesTableView'
import { useRecentChallengesTable } from './useRecentChallengesTable'

export const RecentChallengesTable = () => {
  const { challengingService } = useRestContext()
  const { challenges, isLoading } = useRecentChallengesTable(challengingService)

  return <RecentChallengesTableView challenges={challenges} isLoading={isLoading} />
}
