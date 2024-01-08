'use client'
import { CalendarBlank, GearSix, Shield } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { UserAvatar } from '../../components/UserAvatar'

import { Status } from './Status'

import { User as UserType } from '@/@types/user'
import { Loading } from '@/app/components/Loading'
import { useAuth } from '@/contexts/AuthContext'
import { useImage } from '@/hooks/useImage'
import { useRanking } from '@/hooks/useRanking'
import { useRocket } from '@/hooks/useRocket'
import { useDate } from '@/services/date'

interface UserProps {
  data: UserType
}

export function User({
  data: { id, ranking_id, rocket_id, avatar_id, name, level, xp, created_at },
}: UserProps) {
  const { user } = useAuth()
  const { format } = useDate()
  const isAuthUser = id === user?.id

  const { ranking } = useRanking(ranking_id)
  const { rocket } = useRocket(rocket_id)

  const rankingImage = useImage('rankings', ranking?.image)
  const rocketImage = useImage('rockets', rocket?.image)

  if (!ranking || !rocket || !rankingImage || !rocketImage)
    return <Loading isSmall={false} />

  const createdAt = format(new Date(created_at), 'DD MMMM [de] YYYY')

  return (
    <div className="flex flex-col border-b border-gray-300 pb-6 md:flex-row md:justify-between md:gap-6">
      <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:gap-6">
        <UserAvatar avatarId={avatar_id} size={148} />
        <div className="flex flex-col gap-2 md:items-start">
          <strong className="mt-3 truncate text-center text-lg text-green-500">
            {name}
          </strong>
          <div className="flex items-center justify-center gap-2">
            <Shield
              className="hidden text-lg text-green-500 md:block"
              weight="bold"
            />
            <strong className="text-sm text-gray-100">
              Nível {level} - {xp} xp
            </strong>
          </div>

          <div className="flex items-center justify-center gap-2">
            <CalendarBlank
              className="hidden text-lg text-green-500 md:block"
              weight="bold"
            />
            <p className="text-sm text-gray-300">Por aqui desde {createdAt}</p>
          </div>
        </div>
      </div>

      <dl className="mt-6 flex justify-between md:flex-row md:gap-8">
        <span className="hidden w-[1px] rounded-md bg-gray-300 md:block"></span>
        <Status
          title="Ranking atual"
          image={rankingImage}
          value={ranking.name}
        />
        <Status title="Foguete atual" image={rocketImage} value={rocket.name} />
      </dl>

      <div className="flex h-full w-6 justify-start">
        {isAuthUser && (
          <Link href="/settings">
            <motion.div whileHover={{ rotate: '90deg' }}>
              <GearSix className="hidden text-4xl text-green-500 md:block" />
            </motion.div>
          </Link>
        )}
      </div>
    </div>
  )
}
