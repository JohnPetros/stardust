'use client'

import Image from 'next/image'
import { useRef } from 'react'

import type { RankingWinnerDTO } from '@/@core/dtos'

import { useApi } from '@/infra/api'

import type { AlertDialogRef } from '@/modules/global/components/shared/AlertDialog/types'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { AlertDialog } from '@/modules/global/components/shared/AlertDialog'
import { Button } from '@/modules/global/components/shared/Button'
import { Animation } from '@/modules/global/components/shared/Animation'
import { RankingUser } from '../RankingUsersList/RankingUser'
import { RankingWinner } from './RankingWinner'
import { useRankingWinnerUsersList } from './useRankingWinnerUsersList'

type RankingWinnerUsersListProps = {
  winners: RankingWinnerDTO[]
  onHideWinners: () => void
}

export function RankingWinnerUsersList({
  winners,
  onHideWinners,
}: RankingWinnerUsersListProps) {
  const rewardAlertDialog = useRef<AlertDialogRef>(null)
  const successAlertDialog = useRef<AlertDialogRef>(null)
  const failAlertDialog = useRef<AlertDialogRef>(null)

  const { user } = useAuthContext()
  const { handleAlertDialogButtonClick, handleWinnerUserListButtonClick } =
    useRankingWinnerUsersList({
      rewardAlertDialog,
      successAlertDialog,
      failAlertDialog,
      onHideWinners,
    })
  const api = useApi()

  const rankingImage = user ? api.fetchImage('rankings', user.ranking.image.value) : ''

  if (user)
    return (
      <div className=''>
        <h3 className='text-center text-lg font-semibold text-gray-100'>
          Resultado da semana
        </h3>

        <div className='mt-6 flex items-end justify-center gap-6'>
          {winners.map((winner) => (
            <RankingWinner
              key={winner.id}
              xp={winner.xp}
              name={winner.name}
              avatarImage={winner.avatarImage}
              position={winner.position}
            />
          ))}
        </div>

        <Button onClick={handleWinnerUserListButtonClick} className='mx-auto mt-10 w-72'>
          Continuar
        </Button>

        {user.lastRankingPosition && user.isRankingWinner ? (
          <div className='mx-auto mt-6 max-w-lg'>
            <p className='mb-3 text-center font-medium text-gray-100'>
              Que pena! Você ficou na {user.lastRankingPosition.position.value}º no
              ranking da última semana.
            </p>
            <RankingUser
              id={user.id}
              name={user.name.value}
              weeklyXp={user.weeklyXp.value}
              position={user.lastRankingPosition.position.value}
              avatarImage={user.avatar.image.value}
              avatarName={user.avatar.name.value}
              losersPositionOffset={16}
              canShowXp={false}
            />
          </div>
        ) : (
          <p className='mt-6 text-center font-medium text-gray-100'>
            Parabéns! Você ficou na {user?.lastRankingPosition?.position.value}º no
            ranking da última semana 🎉!
          </p>
        )}

        <AlertDialog
          ref={rewardAlertDialog}
          type={'earning'}
          title={'Recompensa resgatada!'}
          body={
            <div>
              <p className='mt-3 text-center text-green-100'>
                Parabéns! Você acabou de ganhar{' '}
                <span className='text-lg font-medium text-green-500'>
                  {user.lastRankingPosition?.position.value}
                </span>{' '}
                de poeira estela por ter ficado entre os três primeiros.
              </p>
            </div>
          }
          action={
            <Button
              onClick={() => handleAlertDialogButtonClick('reward')}
              className='mt-6'
            >
              Entendido
            </Button>
          }
          shouldPlayAudio={false}
        />

        <AlertDialog
          ref={successAlertDialog}
          type={'earning'}
          title={'Novo ranking!'}
          body={
            <div className='flex flex-col items-center justify-center gap-6'>
              <p className='mt-3 text-center text-gray-100'>
                Parabéns! Você acaba de chegar no ranking:
                <br />
                <span className='text-lg font-medium text-green-500'>
                  {user.ranking.name.value}
                </span>
              </p>

              <div className='relative'>
                <span className='absolute -left-7 -top-10 z-0'>
                  <Animation name='shinning' size={140} />
                </span>

                <div className='z-[60]'>
                  <Image
                    src={rankingImage}
                    width={80}
                    height={80}
                    alt={user.ranking.name.value}
                  />
                </div>
              </div>
            </div>
          }
          action={
            <Button
              onClick={() => handleAlertDialogButtonClick('success')}
              className='mt-6'
            >
              Entendido
            </Button>
          }
          shouldPlayAudio={false}
        />

        <AlertDialog
          ref={failAlertDialog}
          type={'crying'}
          title={'Perda de Ranking!'}
          body={
            <div className='mt-3 flex flex-col items-center justify-center gap-3'>
              <p className='text-center text-gray-100'>
                Puxa vida, parece que você desceu para o ranking:
                <br />
                <span className='text-lg font-semibold text-green-500'>
                  {user.ranking.name.value}
                </span>
              </p>
              <Image
                src={rankingImage}
                width={72}
                height={72}
                alt={user.ranking.name.value}
                style={{ opacity: 0.3 }}
              />
            </div>
          }
          action={
            <Button
              title={'Entendido'}
              onClick={() => handleAlertDialogButtonClick('fail')}
              className='mt-6'
            >
              Entendido
            </Button>
          }
          shouldPlayAudio={true}
        />
      </div>
    )
}
