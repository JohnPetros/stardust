'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRocket } from '@/hooks/useRocket'
import { useRanking } from '@/hooks/useRanking'

import { UserAvatar } from '../../components/UserAvatar'
import { Status } from './Status'

import { getImage } from '@/utils/functions'

import { User as UserType } from '@/types/user'

interface UserProps {
  data: UserType
}

export function User({
  data: { id, ranking_id, rocket_id, avatar_id, name, level, xp, created_at },
}: UserProps) {
  const { user } = useAuth()
  const isAuthUser = id === user?.id

  const { ranking } = useRanking(ranking_id)
  const { rocket } = useRocket(rocket_id)

  if (!ranking || !rocket) return null

  const rankingImage = getImage('rankings', ranking.image)
  const rocketImage = getImage('rockets', rocket.image)

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-1">
        <UserAvatar avatarId={avatar_id} size={148} />
        <strong className="text-green-500 text-xl text-center mt-3">
          {name}
        </strong>
        <strong className="text-gray-100">
          Nível {level} - {xp} xp
        </strong>
        <strong className="text-gray-100"></strong>
        <p className="text-gray-300">Por aqui desde 16 de março de 2023</p>
      </div>

      <dl className="flex justify-between mt-6">
        <Status
          title="Ranking atual"
          image={rankingImage}
          value={ranking.name}
        />
        <Status title="Ranking atual" image={rocketImage} value={rocket.name} />
      </dl>
    </div>
  )
}
