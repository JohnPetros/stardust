'use client'
import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'

import Image from 'next/image'
import { Modal, ModalRef } from '@/app/components/Modal'
import { Button } from '@/app/components/Button'
import { ShinningAnimation } from '../../../components/ShinningAnimation'
import { WinnerUser } from './WinnerUser'
import { RankedUser } from '../RankedUsersList/RankedUser'

import { getImage, playSound } from '@/utils/functions'

import type { Ranking } from '@/types/ranking'
import type { WinnerUser as WinnerUserType } from '@/types/user'

interface WinnerUsersListProps {
  winnerUsers: WinnerUserType[]
  setWinnerUsers: (winnerUsers: WinnerUserType[]) => void
  isAuthUserWinner: boolean
  currentRanking: Ranking
  lastRankingPosition: number
}

export function WinnerUsersList({
  winnerUsers,
  setWinnerUsers,
  isAuthUserWinner,
  currentRanking,
  lastRankingPosition,
}: WinnerUsersListProps) {
  const { user, updateUser } = useAuth()

  const isAuthUserTopWinner = user?.last_position
    ? [1, 2, 3].includes(user.last_position)
    : false

  function getRewardMultiplicator() {
    if (!user?.last_position) return 0

    switch (user.last_position) {
      case 1:
        return 3
      case 2:
        return 2
      case 3:
        return 1
      default:
        return user.last_position
    }
  }

  const rewardByLastPosition = user?.last_position
    ? currentRanking.reward + 5 * getRewardMultiplicator()
    : 0

  const rewardModal = useRef<ModalRef>(null)
  const successModal = useRef<ModalRef>(null)
  const failModal = useRef<ModalRef>(null)

  const rankingImage = getImage('rankings', currentRanking.image)

  async function handleWinnerUserListButtonClick() {
    if (user && isAuthUserTopWinner) {
      rewardModal.current?.open()
      await updateUser({ coins: user.coins + rewardByLastPosition })
      return
    }

    if (isAuthUserWinner) {
      successModal.current?.open()
      return
    }

    if (user?.is_loser) {
      failModal.current?.open()
      await updateUser({ is_loser: false })
      return
    }

    setWinnerUsers([])
  }

  function handleModalButtonPress(type: 'reward' | 'success' | 'fail') {
    console.log(currentRanking.position === lastRankingPosition)

    if (type === 'reward') {
      rewardModal.current?.close()
      const hasNextRanking = currentRanking.position !== lastRankingPosition

      console.log(hasNextRanking)

      hasNextRanking
        ? successModal.current?.open()
        : handleModalButtonPress('success')
      return
    }

    successModal.current?.close()
    failModal.current?.close()
    setWinnerUsers([])
  }

  return (
    <div className="">
      <h3 className="text-center text-lg text-gray-100 font-semibold">
        Resultado da semana
      </h3>

      <div className="flex gap-6 justify-center items-end mt-6">
        {winnerUsers.map((winnerUser) => (
          <WinnerUser key={winnerUser.id} data={winnerUser} />
        ))}
      </div>

      <Button
        onClick={handleWinnerUserListButtonClick}
        className="mx-auto w-72 mt-10"
      >
        Continuar
      </Button>

      {user?.last_position && !isAuthUserWinner ? (
        <div className="mt-6 max-w-lg mx-auto">
          <p className="text-gray-100 font-medium text-center mb-3">
            Que pena! Você ficou na {user?.last_position}º no ranking da última
            semana.
          </p>
          <RankedUser
            data={user}
            position={user?.last_position}
            isAuthUser={true}
            lastPositionsOffset={16}
            canShowXp={false}
          />
        </div>
      ) : (
        <p className="text-gray-100 font-medium text-center mt-6">
          Parabéns! Você ficou na {user?.last_position}º no ranking da última
          semana 🎉!
        </p>
      )}

      <Modal
        ref={rewardModal}
        type={'earning'}
        title={'Recompensa resgatada!'}
        body={
          <div className="">
            <p className="text-center text-green-100 mt-3">
              Parabéns! Você acabou de ganhar{' '}
              <span className="text-lg text-green-500 font-medium">
                {rewardByLastPosition}
              </span>{' '}
              de poeira estela por ter ficado em os três primeiros.
            </p>
          </div>
        }
        footer={
          <Button
            onClick={() => handleModalButtonPress('reward')}
            className="mt-6"
          >
            Entendido
          </Button>
        }
        canPlaySong={false}
      />

      <Modal
        ref={successModal}
        type={'earning'}
        title={'Novo ranking!'}
        body={
          <div className="flex flex-col items-center justify-center gap-6">
            <p className="text-center text-gray-100 mt-3">
              Parabéns! Você acaba de chegar no ranking:
              <br />
              <span className="text-lg text-green-500 font-medium">
                {currentRanking.name}
              </span>
            </p>

            <div className="relative">
              <span className="absolute -top-10 -left-7 z-0">
                <ShinningAnimation size={140} />
              </span>

              <div className="z-[60]">
                <Image
                  src={rankingImage}
                  width={80}
                  height={80}
                  alt={currentRanking.name}
                />
              </div>
            </div>
          </div>
        }
        footer={
          <Button
            onClick={() => handleModalButtonPress('success')}
            className="mt-6"
          >
            Entendido
          </Button>
        }
        canPlaySong={false}
      />

      <Modal
        ref={failModal}
        type={'crying'}
        title={'Perda de Ranking!'}
        body={
          <div className="flex flex-col gap-3 items-center justify-center mt-3">
            <p className="text-gray-100 text-center">
              Puxa vida, parece que você desceu para o ranking:
              <br />
              <span className="font-semibold text-lg text-green-500">
                {currentRanking.name}
              </span>
            </p>
            <Image
              src={rankingImage}
              width={72}
              height={72}
              alt={currentRanking.name}
              style={{ opacity: 0.3 }}
            />
          </div>
        }
        footer={
          <Button
            title={'Entendido'}
            onClick={() => handleModalButtonPress('fail')}
            className="mt-6"
          >
            Entendido
          </Button>
        }
        canPlaySong={true}
      />
    </div>
  )
}
