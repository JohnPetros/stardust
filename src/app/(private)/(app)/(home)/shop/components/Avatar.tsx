'use client'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSWRConfig } from 'swr'

import Image from 'next/image'
import { Button } from '@/app/components/Button'
import { Modal, ModalRef } from '@/app/components/Modal'
import { LockSimple } from '@phosphor-icons/react'

import { Avatar } from '@/@types/avatar'
import { getImage, playSound } from '@/utils/functions'
import { twMerge } from 'tailwind-merge'

import RewardShinning from '../../../../../../../public/animations/reward-shinning.json'

import Lottie from 'lottie-react'

interface AvatarProps {
  data: Avatar
  addUserAcquiredAvatar: (AvatarId: string) => void
}

export function Avatar({
  data: { id, name, price, image, isAcquired },
  addUserAcquiredAvatar,
}: AvatarProps) {
  const { user, updateUser } = useAuth()

  const { mutate } = useSWRConfig()

  const [isSelected, setIsSelected] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const avatarImage = getImage('avatars', image)
  const isBuyable = user ? user?.coins >= price : false

  const denyingModalRef = useRef<ModalRef>(null)
  const earningModalRef = useRef<ModalRef>(null)

  async function buyAvatar() {
    setIsRequesting(true)

    if (!isBuyable || !user) {
      setIsRequesting(false)
      denyingModalRef.current?.open()

      return
    }

    try {
      await Promise.all([
        updateUser({
          coins: user.coins - price,
        }),
        addUserAcquiredAvatar(id),
        selectAvatar(),
      ])

      earningModalRef.current?.open()
    } catch (error) {
      console.error(error)
    } finally {
      setIsRequesting(false)
    }
  }

  async function selectAvatar() {
    try {
      await updateUser({ avatar_id: id })
      playSound('switch.wav')
      mutate('/avatar?id=' + id, { id, name, image })
    } catch (error) {
      console.error(error)
    } finally {
      setIsRequesting(false)
    }
  }

  async function handleButtonPress() {
    setIsRequesting(true)

    if (isAcquired) {
      await selectAvatar()
      return
    }

    buyAvatar()
  }

  useEffect(() => {
    setIsSelected(id === user?.avatar_id)
  }, [user?.avatar_id])

  return (
    <>
      <div
        className={twMerge(
          'grid grid-cols-[1fr_1.4fr] rounded-md overflow-hidden border-2',
          isSelected ? 'border-yellow-300' : 'border-transparent',
          !isAcquired && !isBuyable ? 'brightness-75' : 'brightness-90'
        )}
      >
        <div className="flex flex-col justify-between bg-gray-800 p-6">
          <div className="flex flex-col gap-2">
            {!isAcquired && price > 0 && (
              <div className=" flex items-center gap-2 z-30">
                <Image src="/icons/coin.svg" width={24} height={24} alt="" />
                <strong className="font-semibold text-gray-100 text-lg">
                  {price}
                </strong>
              </div>
            )}
            <strong className="text-gray-100">{name}</strong>
          </div>

          <Button
            className="bg-yellow-300 w-max py-1 px-3 h-10"
            onClick={handleButtonPress}
            isLoading={isRequesting}
          >
            {isSelected && isAcquired
              ? 'Selecionado'
              : isAcquired
              ? 'Selecionar'
              : 'Comprar'}
          </Button>
        </div>

        <div className="relative h-52">
          {!isAcquired && (
            <div className="absolute top-3 right-3 z-30">
              <LockSimple className="text-gray-800 text-xl" weight="bold" />
            </div>
          )}

          <Image src={avatarImage} fill alt={name} />
        </div>
      </div>

      <Modal
        ref={denyingModalRef}
        type="denying"
        title="Parece que você não tem poeira estelar o suficiente"
        body={
          <p className="text-gray-100 font-medium text-sm text-center my-6 px-6">
            Mas você pode adquirir mais completando estrelas ou resolvendo
            desafios.
          </p>
        }
        footer={
          <Button onClick={denyingModalRef.current?.close}>Entendido</Button>
        }
      />

      <Modal
        ref={earningModalRef}
        type="earning"
        title="Parabéns, você acabou de adquiriu um novo avatar!"
        body={
          <div className="relative flex flex-col items-center justify-center">
            <span className="absolute -top-8 left-25">
              <Lottie
                animationData={RewardShinning}
                loop={true}
                style={{ width: 240 }}
              />
            </span>
            <div className="relative w-32 h-32 mt-6">
              <Image src={avatarImage} fill alt={name} />
            </div>
            <strong className="text-gray-100 my-6">{name}</strong>
          </div>
        }
        footer={
          <Button onClick={earningModalRef.current?.close}>Entendido</Button>
        }
      />
    </>
  )
}
