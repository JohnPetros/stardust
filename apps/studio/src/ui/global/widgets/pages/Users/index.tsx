import { useUsersPage } from './useUsersPage'
import { UsersPageView } from './UsersPageView'
import { useRest } from '@/ui/global/hooks/useRest'

export const UsersPage = () => {
  const { profileService } = useRest()
  const usersPage = useUsersPage({ service: profileService })

  return <UsersPageView {...usersPage} />
}
