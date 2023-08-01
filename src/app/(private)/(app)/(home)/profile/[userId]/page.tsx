import { api } from '@/services/api'
import { User } from '../components/User'
import { Statistics } from '../components/Statistics'
import { Tabs } from '../components/Tabs'
import { Streak } from '../components/Streak'
import { ChallengesChart } from '../components/ChallengesChart'
import { Achievements } from '../components/Achievements'
import { Loading } from '@/app/components/Loading'

interface ProfileProps {
  params: { userId: string }
}

export default async function Profile({ params }: ProfileProps) {
  const user = await api.getUser(params.userId)

  if (user.id)
    return (
      <div className="pt-8 max-w-sm md:max-w-5xl mx-auto px-6">
        <User data={user} />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] justify-center items-center md:flex-row gap-12 mt-10">
          <Statistics data={user} />
          <Streak data={user} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-2 mt-10">
          <div>
            <h4 className="text-gray-100">Desafios concluídos</h4>
            <ChallengesChart userId={user.id} />
          </div>
          <div>
            <h4 className="text-gray-100 text-center mb-3">
              Conquistas adquiridas
            </h4>
            <div>
              <Achievements userId={user.id} />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Tabs />
        </div>
      </div>
    )
  else return <Loading isSmall={false} />
}
