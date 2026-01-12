import { useRest } from '@/ui/global/hooks/useRest'
import { UsersTable } from '@/ui/global/widgets/components/UsersTable'
import { useRecentUsersTable } from './useRecentUsersTable'

export const RecentUsersTable = () => {
  const { profileService } = useRest()
  const { users, isLoading, sorters, onSort } = useRecentUsersTable(profileService)

  return (
    <UsersTable users={users} isLoading={isLoading} sorters={sorters} onSort={onSort} />
  )
}
