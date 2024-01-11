'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LottieRef } from 'lottie-react'

import { CongratulationsProps } from '.'

import { AlertRef } from '@/app/components/Alert'
import { useAuth } from '@/contexts/AuthContext'
import { playSound } from '@/utils/helpers'

export function useCongratulations({
  userDataUpdater,
  accurance,
  coins,
  xp,
  onExit,
}: Omit<CongratulationsProps, 'time'>) {
  const { user, updateUser } = useAuth()

  const [hasNewLevel, setHasNewLevel] = useState(false)
  const [isFirstClick, setIsFirstClick] = useState(true)
  const [isStreakVisible, setIsStreakVisible] = useState(false)
  const [isEndMessageVisible, setIsEndMessageVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const alertRef = useRef<AlertRef>(null)
  const starsChainRef = useRef(null) as LottieRef

  const getUpdatedLevel = useCallback(
    (updatedXp: number) => {
      if (!user) return

      const hasNewLevel = updatedXp >= 50 * (user.level - 1) + 25

      if (hasNewLevel) {
        const newLevel = user.level + 1
        setHasNewLevel(hasNewLevel)

        return newLevel
      }

      return user.level
    },
    [user]
  )

  const getUpdatedUserData = useCallback(async () => {
    if (!user) return
    return await userDataUpdater({ newCoins: coins, newXp: xp, user })
  }, [user, coins, xp, userDataUpdater])

  const updateUserData = useCallback(async () => {
    try {
      const updatedUserData = await getUpdatedUserData()

      console.log({ updatedUserData })

      if (updatedUserData) {
        const updatedLevel = updatedUserData.xp
          ? getUpdatedLevel(updatedUserData.xp)
          : user?.level

        const data = { ...updatedUserData, level: updatedLevel }

        await updateUser(data)
      }
    } catch (error) {
      throw new Error(error)
    }
  }, [getUpdatedLevel, getUpdatedUserData, updateUser, user])

  const pauseStarsAnimation = useCallback(() => {
    const totalStars = (parseInt(accurance) * 5) / 100

    starsChainRef.current?.goToAndPlay(0)

    const delay = 500 * (!isNaN(totalStars) ? totalStars : 5)

    setTimeout(() => {
      starsChainRef.current?.pause()
    }, delay)
  }, [accurance])

  function handleFirstButtonClick() {
    if (!user) return

    const todayIndex = new Date().getDay()
    const todayStatus = user.week_status[todayIndex]

    setIsFirstClick(false)

    if (hasNewLevel) {
      alertRef.current?.open()
    }

    const isStreakVisible = todayStatus === 'todo'

    if (isStreakVisible) {
      setIsStreakVisible(true)
      return
    }

    setIsEndMessageVisible(true)
  }

  function handleSecondButtonClick() {
    setIsLoading(true)
    onExit()
  }

  useEffect(() => {
    pauseStarsAnimation()

    playSound('earning.wav')

    const time = setTimeout(async () => {
      await updateUserData()
    }, 250)

    return () => clearTimeout(time)
  }, [updateUserData, pauseStarsAnimation])

  return {
    isFirstClick,
    isStreakVisible,
    isEndMessageVisible,
    isLoading,
    alertRef,
    starsChainRef,
    handleSecondButtonClick,
    handleFirstButtonClick,
  }
}
