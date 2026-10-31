import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { UsersTable } from '@/ui/global/widgets/components/UsersTable'
import { useRecentUsersTable } from './useRecentUsersTable'

export const RecentUsersTable = () => {
  const { profileService } = useRestContext()
  const { users, isLoading, orders, onOrderChange } = useRecentUsersTable(profileService)

  return (
    <UsersTable
      users={users}
      isLoading={isLoading}
      orders={orders}
      onOrderChange={onOrderChange}
    />
  )
}
