import { NextPage } from 'next'
import { api } from '@/services/api'
import { User } from '../components/User'

interface ProfileProps {
  params: { userId: string }
}

export default async function Profile({ params }: ProfileProps) {
  const user = await api.getUser(params.userId)

  return (
    <div className="pt-8 max-w-sm md:max-w-[1024px] mx-auto">
      <User data={user} />
    </div>
  )
}
