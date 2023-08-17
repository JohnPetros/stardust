import { ReactNode, createContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSWRConfig } from 'swr'
import { useAchievement } from '@/hooks/useAchievement'
import { useApi } from '@/services/api'

import { Modal, ModalRef } from '@/app/components/Modal'
import { Achievement } from '@/app/(private)/(app)/(home)/components/Achievement'
import { ShinningAnimation } from '@/app/(private)/(app)/(home)/components/ShinningAnimation'

import { Achievement as AchievementType } from '@/types/achievement'
import { Button } from '@/app/components/Button'

interface AchivementsContextValue {
  achievements: AchievementType[] | undefined
}

interface AchivementsContextProps {
  children: ReactNode
}

export const AchivementsContext = createContext({} as AchivementsContextValue)

export function AchivementsProvider({ children }: AchivementsContextProps) {
  const { user } = useAuth()
  const { achievements: data } = useAchievement(user?.id)
  const [achievements, setAchievements] = useState<AchievementType[]>(
    data ?? []
  )
  const [newUnlockedAchievements, setNewUnlockedAchievements] = useState<
    AchievementType[]
  >([])

  const api = useApi()

  const modalRef = useRef<ModalRef>(null)

  const { cache } = useSWRConfig()

  function handleModalClose() {
    modalRef.current?.close()
    setNewUnlockedAchievements([])
  }

  function addCurrentProgress(achievement: AchievementType) {
    if (!user) return achievement

    const currentProgress = user[achievement.metric]

    return { ...achievement, currentProgress }
  }

  function updateAchivement(
    achievement: AchievementType,
    newUnlockedAchievements: AchievementType[]
  ) {
    if (achievement.isUnlocked) return achievement

    const isUnlocked = newUnlockedAchievements.some(
      (unlockedAchievement) => unlockedAchievement.id === achievement.id
    )

    return { ...achievement, isUnlocked, isRescuable: isUnlocked }
  }

  function isAchievementUnlocked(achievement: AchievementType) {
    if (!user) return false

    switch (achievement.metric) {
      case 'unlocked_stars':
        return user.unlocked_stars >= achievement.required_amount - 1
      case 'acquired_rockets':
        return user.acquired_rockets >= achievement.required_amount
      case 'xp':
        return user.xp >= achievement.required_amount
      case 'completed_challenges':
        return user.completed_challenges >= achievement.required_amount
      case 'streak':
        return user.streak >= achievement.required_amount
      default:
        return false
    }
  }

  async function checkNewUnlockedAchivements(achievements: AchievementType[]) {
    if (!achievements || !user) return

    const newUnlockedAchievements = achievements.filter(isAchievementUnlocked)

    if (newUnlockedAchievements) {
      // for (const { id } of newUnlockedAchievements) {
      //   await Promise.all([
      //     api.addUserUnlockedAchievement(id, user.id),
      //     api.addUserRescuableAchievements(id, user.id),
      //   ])
      // }

      const updatedAchievements = achievements.map((achievement) =>
        updateAchivement(achievement, newUnlockedAchievements)
      )

      setAchievements(updatedAchievements)
      setNewUnlockedAchievements(newUnlockedAchievements)
    }
  }

  useEffect(() => {
    if (data) {
      const achievements = data.map(addCurrentProgress)
      setAchievements(achievements)
      checkNewUnlockedAchivements(achievements)
    }
  }, [data])

  useEffect(() => {
    checkNewUnlockedAchivements(achievements)
  }, [user])

  useEffect(() => {
    if (newUnlockedAchievements.length) {
      modalRef.current?.open()
    }
  }, [newUnlockedAchievements])

  return (
    <AchivementsContext.Provider value={{ achievements }}>
      <Modal
        ref={modalRef}
        type={'earning'}
        title={'Uau! Parece que você ganhou recompensa(s)'}
        body={
          <div className="space-y-24 px-6 max-h-64">
            {newUnlockedAchievements.map((achievement) => (
              <div className="relative z-50">
                <span className="block absolute" style={{ top: -18, left: -31.5 }}>
                  <ShinningAnimation size={110} />
                </span>

                <Achievement data={achievement} isUnlocked={true} />
              </div>
            ))}
          </div>
        }
        footer={
          <div className="mt-10">
            <Button onClick={handleModalClose}>Entendido</Button>
          </div>
        }
      />
      {children}
    </AchivementsContext.Provider>
  )
}
