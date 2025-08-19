import type { NextParams } from '@/rpc/next/types'
import { profileActions } from '@/rpc/next-safe-action'
import { SettingsPage } from '@/ui/profile/widgets/pages/Settings'

const Page = async ({ params }: NextParams<'userSlug'>) => {
  const { userSlug } = await params
  const response = await profileActions.accessProfilePage({
    userSlug,
  })
  if (!response?.data) return
  const userDto = response.data

  return <SettingsPage userDto={userDto} />
}

export default Page
