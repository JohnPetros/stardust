import type { NextParams } from '@/rpc/next/types'
import { ProfilePage } from '@/ui/profile/widgets/pages/Profile'
import { profileActions } from '@/rpc/next-safe-action'

const Profile = async ({ params }: NextParams<'userSlug'>) => {
  const { userSlug } = await params
  const response = await profileActions.accessProfilePage({
    userSlug,
  })
  if (!response?.data) return
  const userDto = response.data

  return <ProfilePage userDto={userDto} />
}

export default Profile
