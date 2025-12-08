import { useRest } from '@/ui/global/hooks/useRest'
import { RecentUsersTableView } from './RecentUsersTableView'
import { useRecentUsersTable } from './useRecentUsersTable'

export const RecentUsersTable = () => {
  const { profileService } = useRest()
  const { users, isLoading } = useRecentUsersTable(profileService)

  return <RecentUsersTableView users={users} isLoading={isLoading} />
}
