'use client'

import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

import { RocketProps } from '.'

import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useAudio } from '@/hooks/useAudio'
import { useApi } from '@/services/api'

export function useRocketItem({
  data: { id, name, price, image, isAcquired },
  addUserAcquiredRocket,
}: RocketProps) {
  const { user, updateUser } = useAuth()

  const { mutate } = useSWRConfig()

  const [isSelected, setIsSelected] = useState(false)

  const toast = useToast()
  const api = useApi()
  const audio = useAudio('switch.wav')

  const rocketImage = api.getImage('rockets', image)
  const isBuyable = user ? user?.coins >= price : false

  async function handleShopSuccess() {
    if (user) {
      const updatedCoins = user?.coins - price
      const updatedAcquiredRockets = user?.acquired_rockets + 1

      await Promise.all([
        updateUser({
          coins: updatedCoins,
          acquired_rockets: updatedAcquiredRockets,
        }),
        addUserAcquiredRocket(id),
      ])
    }
  }

  async function selectRocket() {
    try {
      await updateUser({ rocket_id: id })
      mutate('/rocket?id=' + id, { id, name, image })

      audio?.play()
    } catch (error) {
      toast.show('Erro ao tentar selecionar o foguete ' + name, {
        type: 'error',
      })
    }
  }

  async function buyRocket() {
    if (!isBuyable || !user) {
      return
    }

    try {
      await selectRocket()
    } catch (error) {
      toast.show('Erro ao tentar selecionar o foguete ' + name, {
        type: 'error',
      })
      console.error(error)
    }
  }

  async function handleShopButton() {
    if (isAcquired) {
      await selectRocket()
      return
    }

    buyRocket()
  }

  useEffect(() => {
    if (user) setIsSelected(id === user.rocket_id)
  }, [id, user])

  return {
    isSelected,
    isBuyable,
    rocketImage,
    handleShopSuccess,
    handleShopButton,
  }
}
