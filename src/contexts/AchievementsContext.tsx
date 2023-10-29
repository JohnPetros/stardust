import { ReactNode, createContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAchievement } from '@/hooks/useAchievement'
import { useApi } from '@/services/api'

import Image from 'next/image'
import { Modal, ModalRef } from '@/app/components/Modal'
import { Achievement } from '@/app/(private)/(app)/(home)/components/Achievement'
import { ShinningAnimation } from '@/app/(private)/(app)/(home)/components/ShinningAnimation'
import { ToastRef, Toast } from '@/app/components/Toast'
import { Button } from '@/app/components/Button'

import type { Achievement as AchievementData } from '@/@types/achievement'

type RescuableAchivement = {
  id: string
  name: string
  reward: number
  image: string
}

interface AchivementsContextValue {
  achievements: AchievementData[] | undefined
  rescueableAchievementsAmount: number
  rescueAchivement: (rescuableAchiement: RescuableAchivement) => void
}

interface AchivementsContextProps {
  children: ReactNode
}

export const AchivementsContext = createContext({} as AchivementsContextValue)

export function AchivementsProvider({ children }: AchivementsContextProps) {
  const { user, updateUser } = useAuth()
  const { achievements: data } = useAchievement(user?.id)
  const [achievements, setAchievements] = useState<AchievementData[]>(
    data ?? []
  )
  const [newUnlockedAchievements, setNewUnlockedAchievements] = useState<
    AchievementData[]
  >([])
  const [rescuedAchievement, setRescuedAchievement] =
    useState<RescuableAchivement | null>(null)
  const [rescueableAchievementsAmount, setRescueableAchievementsAmount] =
    useState(0)

  const [isLoading, setIsLoading] = useState(false)

  const api = useApi()

  const toastRef = useRef<ToastRef>(null)

  const newUnlockedAchievementsModalRef = useRef<ModalRef>(null)
  const rescuedAchievementModalRef = useRef<ModalRef>(null)

  async function removeRescuedAchievement(achievementId: string) {
    if (!user) return

    try {
      await api.deleteUserRescuebleAchievement(achievementId, user.id)
      const updatedAchievements = achievements.map((achievement) =>
        achievement.id === achievementId
          ? { ...achievement, isRescuable: false }
          : achievement
      )

      setAchievements(updatedAchievements)
    } catch (error) {
      console.error(error)
      toastRef.current?.open({
        type: 'error',
        message: 'Erro ao resgatar a conquista',
      })
    }
  }

  async function rescueAchivement(rescuableAchievement: RescuableAchivement) {
    if (!user) return

    setRescuedAchievement(rescuableAchievement)

    rescuedAchievementModalRef.current?.open()

    setIsLoading(true)
    try {
      await Promise.all([
        removeRescuedAchievement(rescuableAchievement.id),
        updateUser({ coins: user.coins + rescuableAchievement.reward }),
      ])

      setRescueableAchievementsAmount(rescueableAchievementsAmount - 1)
    } catch (error) {
      console.error(error)
      toastRef.current?.open({
        type: 'error',
        message: 'Erro ao resgatar a conquista',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleRescuedAchievementModalClose() {
    setRescuedAchievement(null)
    rescuedAchievementModalRef.current?.close()
  }

  function handleNewUnlockedAchievementsModalClose() {
    newUnlockedAchievementsModalRef.current?.close()
    setNewUnlockedAchievements([])
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

    setRescueableAchievementsAmount(rescueableAchievementsAmount + 1)

    return { ...achievement, isUnlocked, isRescuable: isUnlocked }
  }

  function isNewAchievementUnlocked(achievement: AchievementData) {
    if (!user || achievement.isUnlocked) return false

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

  async function checkNewUnlockedAchivements(achievements: AchievementData[]) {
    if (!achievements || !user) return

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
      newUnlockedAchievementsModalRef.current?.open()
    }
  }, [newUnlockedAchievements])

  return (
    <AchivementsContext.Provider
      value={{ achievements, rescueableAchievementsAmount, rescueAchivement }}
    >
      <Toast ref={toastRef} />

      <Modal
        ref={newUnlockedAchievementsModalRef}
        type={'earning'}
        title={'Uau! Parece que você ganhou recompensa(s)'}
        body={
          <div className="space-y-24 px-6 max-h-64">
            {newUnlockedAchievements.map((achievement) => (
              <div className="relative z-50">
                <span
                  className="block absolute"
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
        footer={
          <div className="mt-10">
            <Button onClick={handleNewUnlockedAchievementsModalClose}>
              Entendido
            </Button>
          </div>
        }
      />

      <Modal
        ref={rescuedAchievementModalRef}
        type={'earning'}
        title={'Recompensa resgatada!'}
        body={
          <div className="flex flex-col items-center">
            <p className="text-gray-100 text-center font-medium">
              Parabéns! Você acabou de ganhar{' '}
              <span className="text-lg text-yellow-400 font-semibold">
                {rescuedAchievement?.reward}
              </span>{' '}
              de poeira estela pela conquista:
            </p>
            {rescuedAchievement && (
              <div className="flex flex-col items-center justify-center mt-6">
                <Image
                  src={rescuedAchievement.image}
                  width={40}
                  height={40}
                  alt=""
                />
                <p className="font-semibold text-center text-green-500 mt-2">
                  {rescuedAchievement?.name}
                </p>
              </div>
            )}
          </div>
        }
        footer={
          <Button
            onClick={handleRescuedAchievementModalClose}
            isLoading={isLoading}
            disabled={isLoading}
            className="mt-6"
          >
            Entendido
          </Button>
        }
      />
      {children}
    </AchivementsContext.Provider>
  )
}
