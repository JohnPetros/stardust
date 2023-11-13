'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { Achievements } from '../components/Achievements'
import { ChallengesChart } from '../components/ChallengesChart'
import { Statistics } from '../components/Statistics'
import { StreakBoard } from '../components/Streak'
import { Tabs } from '../components/Tabs'
import { User } from '../components/User'

import { Loading } from '@/app/components/Loading'
import { useUser } from '@/hooks/useUser'

export default function Profile() {
  const params = useParams()
  const { user } = useUser(String(params.userId))
  const [isFistRendering, setIsFistRendering] = useState(true)

  useEffect(() => {
    if (user && isFistRendering) {
      setTimeout(() => {
        setIsFistRendering(false)
      }, 1500)
    }
  }, [user])

  if (user?.id)
    return (
      <div className="mx-auto max-w-sm px-6 pb-32 pt-8 md:max-w-5xl md:pb-12">
        {isFistRendering && <Loading isSmall={false} />}
        {user?.id && (
          <div>
            <User data={user} />
            <div className="mt-10 grid grid-cols-1 items-center justify-center gap-12 md:grid-cols-[1fr_2fr] md:flex-row">
              <Statistics data={user} />
              <StreakBoard
                weekStatus={user.week_status}
                streakAmount={user.streak}
              />
            </div>
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.5fr]">
              <div>
                <h4 className="text-gray-100">Desafios concluídos</h4>
                <ChallengesChart userId={user.id} />
              </div>
              <div>
                <h4 className="mb-3 text-center text-gray-100">
                  Conquistas adquiridas
                </h4>
                <div>
                  <Achievements userId={user.id} />
                </div>
              </div>
            </div>

            <div className="mt-20">
              <Tabs />
            </div>
          </div>
        )}
      </div>
    )
}
