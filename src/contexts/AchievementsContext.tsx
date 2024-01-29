'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useToast } from './ToastContext'

import type { Achievement as AchievementData } from '@/@types/achievement'
import { Achievement } from '@/app/(private)/(app)/(home)/components/Achievement'
import { ShinningAnimation } from '@/app/(private)/(app)/(home)/components/ShinningAnimation'
import { Alert, AlertRef } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useUserAchievements } from '@/hooks/useUserAchievements'
import { useApi } from '@/services/api'

export type AchivementsContextValue = {
  achievements: AchievementData[] | undefined
  rescueableAchievementsCount: number
  rescueAchivement: (
    rescuableAchiementId: string,
    rescuableAchiementReward: number
  ) => Promise<void>
  handleRescuedAchievementsAlertClose: (rescuedAchiementId: string) => void
}

type AchivementsContextProps = {
  children: ReactNode
}

export const AchivementsContext = createContext({} as AchivementsContextValue)

export function AchivementsProvider({ children }: AchivementsContextProps) {
  const { user, updateUser } = useAuth()
  const { userAchievements } = useUserAchievements(user?.id)
  const [achievements, setAchievements] = useState<AchievementData[]>([])
  const [newUnlockedAchievements, setNewUnlockedAchievements] = useState<
    AchievementData[]
  >([])
  const [rescueableAchievementsCount, setRescueableAchievementsCount] =
    useState(0)

  const api = useApi()
  const toast = useToast()

  const newUnlockedAchievementsAlertRef = useRef<AlertRef>(null)

  async function removeRescuedAchievement(achievementId: string) {
    if (!user) return

    try {
      await api.deleteUserRescuebleAchievement(achievementId, user.id)
    } catch (error) {
      console.error(error)
      toast.show('Erro ao resgatar a conquista', {
        type: 'error',
        seconds: 8,
      })
    }
  }

  async function rescueAchivement(
    rescuableAchievementId: string,
    rescuableAchievementReward: number
  ) {
    if (!user) return

    try {
      await Promise.all([
        removeRescuedAchievement(rescuableAchievementId),
        updateUser({ coins: user.coins + rescuableAchievementReward }),
      ])
      setRescueableAchievementsCount(rescueableAchievementsCount - 1)
    } catch (error) {
      toast.show('Erro ao tentar resgatar recompensa', {
        type: 'error',
        seconds: 8,
      })
      console.error(error)
    }
  }

  function handleRescuedAchievementsAlertClose(rescuedAchievementId: string) {
    const updatedAchievements = achievements.map((achievement) =>
      achievement.id === rescuedAchievementId
        ? { ...achievement, isRescuable: false }
        : achievement
    )

    setAchievements(updatedAchievements)
  }

  function handleNewUnlockedAchievementsAlertClose(isOpen: boolean) {
    if (!isOpen) {
      newUnlockedAchievementsAlertRef.current?.close()
      setNewUnlockedAchievements([])
    }
  }

  function addCurrentProgress(achievement: AchievementData) {
    if (!user) return achievement

    const currentProgress = user[achievement.metric]

    return { ...achievement, currentProgress }
  }

  function updateAchivement(
    achievement: AchievementData,
    newUnlockedAchievements: AchievementData[]
  ) {
    if (achievement.isUnlocked) return achievement

    const isUnlocked = newUnlockedAchievements.some(
      (unlockedAchievement) => unlockedAchievement.id === achievement.id
    )

    if (isUnlocked)
      setRescueableAchievementsCount(
        (rescueableAchievementsCount) => rescueableAchievementsCount + 1
      )

    return { ...achievement, isUnlocked, isRescuable: isUnlocked }
  }

  function isNewAchievementUnlocked(achievement: AchievementData) {
    if (!user || achievement.isUnlocked) return false

    switch (achievement.metric) {
      case 'unlocked_stars_count':
        return user.unlocked_stars_count >= achievement.required_count + 1
      case 'completed_planets_count':
        return user.completed_planets_count >= achievement.required_count
      case 'acquired_rockets_count':
        return user.acquired_rockets_count >= achievement.required_count
      case 'completed_challenges_count':
        return user.completed_challenges_count >= achievement.required_count
      case 'xp':
        return user.xp >= achievement.required_count
      case 'streak':
        return user.streak >= achievement.required_count
      default:
        return false
    }
  }

  async function checkNewUnlockedAchivements(achievements: AchievementData[]) {
    if (!achievements?.length || !user) return

    const newUnlockedAchievements = achievements.filter(
      isNewAchievementUnlocked
    )

    if (newUnlockedAchievements) {
      for (const { id } of newUnlockedAchievements) {
        await Promise.all([
          api.addUserUnlockedAchievement(id, user.id),
          api.addUserRescuableAchievements(id, user.id),
        ])
      }

      const updatedAchievements = achievements.map((achievement) =>
        updateAchivement(achievement, newUnlockedAchievements)
      )

      setAchievements(updatedAchievements)
      setNewUnlockedAchievements(newUnlockedAchievements)
    }
  }

  useEffect(() => {
    if (userAchievements && !achievements.length) {
      const achievements = userAchievements.map(addCurrentProgress)
      setAchievements(achievements)
      checkNewUnlockedAchivements(achievements)

      achievements.forEach((achievement) => {
        if (achievement.isRescuable)
          setRescueableAchievementsCount(
            (rescueableAchievementsCount) => rescueableAchievementsCount + 1
          )
      })
    }
  }, [userAchievements])

  useEffect(() => {
    checkNewUnlockedAchivements(achievements)
  }, [user])

  useEffect(() => {
    if (newUnlockedAchievements.length) {
      newUnlockedAchievementsAlertRef.current?.open()
    }
  }, [newUnlockedAchievements])

  return (
    <AchivementsContext.Provider
      value={{
        achievements,
        rescueableAchievementsCount,
        rescueAchivement,
        handleRescuedAchievementsAlertClose,
      }}
    >
      <div className="absolute">
        <Alert
          ref={newUnlockedAchievementsAlertRef}
          type={'earning'}
          title={'Uau! Parece que você ganhou recompensa(s)'}
          body={
            <div className="max-h-64 overflow-auto px-6">
              {newUnlockedAchievements.map((achievement) => (
                <div key={achievement.id} className="relative">
                  <span
                    className="absolute block"
                    style={{ top: -18, left: -31.5 }}
                  >
                    <ShinningAnimation size={110} />
                  </span>

                  <Achievement
                    data={achievement}
                    isUnlocked={true}
                    isRescuable={false}
                  />
                </div>
              ))}
            </div>
          }
          action={
            <div className="mt-8 w-full">
              <Button
                onClick={() => handleNewUnlockedAchievementsAlertClose(false)}
              >
                Entendido
              </Button>
            </div>
          }
          onOpenChange={handleNewUnlockedAchievementsAlertClose}
        />
      </div>
      {children}
    </AchivementsContext.Provider>
  )
}

export function useAchivementsContext() {
  const context = useContext(AchivementsContext)

  if (!context) {
    throw new Error(
      'useAchivementsContext must be used inside AchivementsContext'
    )
  }

  return context
}
