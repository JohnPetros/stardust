import type { NextParams } from '@/rpc/next/types'
import { ProfilePage } from '@/ui/profile/widgets/pages/Profile'
import * as profileActions from '@/rpc/next-safe-action/profileActions'

const Page = async ({ params }: NextParams<'userSlug'>) => {
  const { userSlug } = await params
  const response = await profileActions.accessProfilePage({
    userSlug,
  })
  if (!response?.data) return
  const userDto = response.data

  return <ProfilePage userDto={userDto} />
}

export default Page
