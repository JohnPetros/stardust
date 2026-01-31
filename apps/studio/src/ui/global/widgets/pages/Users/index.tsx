import { useUsersPage } from './useUsersPage'
import { UsersPageView } from './UsersPageView'
import { useRestContext } from '@/ui/global/hooks/useRestContext'

export const UsersPage = () => {
  const { profileService } = useRestContext()
  const usersPage = useUsersPage({ service: profileService })

  return <UsersPageView {...usersPage} />
}
