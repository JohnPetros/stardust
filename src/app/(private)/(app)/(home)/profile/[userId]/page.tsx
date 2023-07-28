import { api } from '@/services/api'
import { User } from '../components/User'
import { Statistics } from '../components/Statistics'
import { Streak } from '../components/Streak'

interface ProfileProps {
  params: { userId: string }
}

export default async function Profile({ params }: ProfileProps) {
  const user = await api.getUser(params.userId)

  return (
    <div className="pt-8 max-w-sm md:max-w-5xl mx-auto px-6">
      <User data={user} />
      <div className='flex flex-col md:flex-row gap-6'>
        <Statistics data={user} />
        <Streak data={user} />
      </div>
    </div>
  )
}
