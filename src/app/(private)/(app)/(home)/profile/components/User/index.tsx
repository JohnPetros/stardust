'use client'

import { CalendarBlank, GearSix, Shield } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { Status } from './Status'

import { Loading } from '@/global/components/Loading'
import { UserAvatar } from '@/global/components/UserAvatar'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useRanking } from '@/global/hooks/useRanking'
import { useRocket } from '@/global/hooks/useRocket'
import { useApi } from '@/services/api'
import { useDate } from '@/services/date'

type UserProps = {
  id: string
  name: string
  rankingId: string
  avatarId: string
  rocketId: string
  level: number
  xp: number
  createdAt: string
}

export function User({
  id,
  name,
  level,
  avatarId,
  rocketId,
  rankingId,
  createdAt,
  xp,
}: UserProps) {
  const { user } = useAuthContext()
  const { format } = useDate()
  const isAuthUser = id === user?.id

  const { ranking } = useRanking(avatarId)
  const { rocket } = useRocket(rocketId)
  const { getImage } = useApi()

  if (!ranking || !rocket) return <Loading isSmall={false} />

  const rankingImage = getImage('rankings', ranking.image)
  const rocketImage = getImage('rockets', rocket.image)

  const formattedCreatedAt = format(new Date(createdAt), 'DD MMMM [de] YYYY')

  return (
    <div className="flex flex-col border-b border-gray-300 pb-6 md:flex-row md:justify-between md:gap-6">
      <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:gap-6">
        <UserAvatar avatarId={avatarId} size={148} />
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
            <p className="text-sm text-gray-300">
              Por aqui desde {formattedCreatedAt}
            </p>
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
