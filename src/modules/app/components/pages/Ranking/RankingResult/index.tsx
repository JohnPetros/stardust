'use client'

import Image from 'next/image'
import { useRef } from 'react'

import { useApi } from '@/infra/api'

import type { AlertDialogRef } from '@/modules/global/components/shared/AlertDialog/types'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { AlertDialog } from '@/modules/global/components/shared/AlertDialog'
import { Button } from '@/modules/global/components/shared/Button'
import { Animation } from '@/modules/global/components/shared/Animation'
import { RankingUser } from '../RankingUsersList/RankingUser'
import { RankingWinner } from './RankingWinner'
import { useRankingResult } from './useRankingResult'
import { _getLastWeekRankingWinners } from './_getLastWeekRankingWinners'

export function RankingResult() {
  const rewardAlertDialog = useRef<AlertDialogRef>(null)
  const successAlertDialog = useRef<AlertDialogRef>(null)
  const failAlertDialog = useRef<AlertDialogRef>(null)

  const {
    isUserLoser,
    lastWeekTier,
    lastWeekRankingWinners,
    handleAlertDialogButtonClick,
    handleWRankingResultButtonClick,
  } = useRankingResult({
    rewardAlertDialog,
    successAlertDialog,
    failAlertDialog,
    _getLastWeekRankingWinners,
  })

  const { user } = useAuthContext()
  const api = useApi()

  const tierImage = user ? api.fetchImage('rankings', user.tier.image.value) : ''

  if (user)
    return (
      <div>
        <h2 className='text-center text-lg font-semibold text-gray-100'>
          Resultado da última semana
        </h2>

        <div className='mt-6 flex items-end justify-center gap-6'>
          {lastWeekRankingWinners.map((winner, index) => (
            <RankingWinner
              key={winner.id}
              xp={winner.xp}
              name={winner.name}
              avatarImage={winner.avatar.image}
              avatarName={winner.avatar.name}
              position={index + 1}
            />
          ))}
        </div>

        <Button onClick={handleWRankingResultButtonClick} className='mx-auto mt-10 w-72'>
          Continuar
        </Button>

        {user.lastWeekRankingPosition && (
          <>
            {!user.isRankingWinner ? (
              <div className='mx-auto mt-6 max-w-lg'>
                <p className='mb-3 text-center font-medium text-gray-100'>
                  Que pena! Você ficou na {user.lastWeekRankingPosition.position.value}º
                  no ranking da última semana.
                </p>
                <RankingUser
                  id={user.id}
                  name={user.name.value}
                  xp={user.weeklyXp.value}
                  position={user.lastWeekRankingPosition.position.value}
                  avatarImage={user.avatar.image.value}
                  avatarName={user.avatar.name.value}
                  losersPositionOffset={16}
                  canShowXp={false}
                />
              </div>
            ) : (
              <p className='mt-6 text-center font-medium text-gray-100'>
                Parabéns! Você ficou na {user.lastWeekRankingPosition.position.value}º no
                ranking da última semana 🎉!
              </p>
            )}

            {user.isTopRankingWinner && (
              <AlertDialog
                ref={rewardAlertDialog}
                type={'earning'}
                title={'Recompensa resgatada!'}
                body={
                  <div>
                    <p className='mt-3 text-center text-green-100'>
                      Parabéns! Você acabou de ganhar{' '}
                      <span className='text-lg font-medium text-green-500'>
                        {user.tier.reward.value}
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
            )}
          </>
        )}

        <AlertDialog
          ref={successAlertDialog}
          type={'earning'}
          title={'Novo tier!'}
          body={
            <div className='flex flex-col items-center justify-center gap-6'>
              <p className='mt-3 text-center text-gray-100'>
                Parabéns! Você acaba de chegar no tier:
                <br />
                <span className='text-lg font-medium text-green-500'>
                  {user.tier.name.value}
                </span>
              </p>

              <div className='relative'>
                <span className='absolute -left-7 -top-10 z-0'>
                  <Animation name='shinning' size={140} />
                </span>

                <div className='z-[60]'>
                  <Image
                    src={tierImage}
                    width={80}
                    height={80}
                    alt={user.tier.name.value}
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

        {isUserLoser && (
          <AlertDialog
            ref={failAlertDialog}
            type={'crying'}
            title={
              user.tier.id !== lastWeekTier?.id
                ? 'Perda de Tier!'
                : 'Permanência de tier baixo'
            }
            body={
              <div className='mt-3 flex flex-col items-center justify-center gap-3'>
                <p className='text-center text-gray-100'>
                  {user.tier.id !== lastWeekTier?.id
                    ? 'Puxa vida, parece que você desceu para o tier:'
                    : 'Você permaneceu no tier:'}
                  <br />
                  <span className='text-lg font-semibold text-green-500'>
                    {user.tier.name.value}
                  </span>
                </p>
                <Image
                  src={tierImage}
                  width={72}
                  height={72}
                  alt={user.tier.name.value}
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
        )}
      </div>
    )
}
