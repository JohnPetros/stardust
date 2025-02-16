'use client'

import Image from 'next/image'
import { useRef } from 'react'

import { useApi } from '@/ui/global/hooks/useApi'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { RankingUser } from '../RankingUsersList/RankingUser'
import { RankingWinner } from './RankingWinner'
import { useRankingResult } from './useRankingResult'
import { Loading } from '@/ui/global/widgets/components/Loading'

export function RankingResult() {
  const rewardAlertDialog = useRef<AlertDialogRef>(null)
  const successAlertDialog = useRef<AlertDialogRef>(null)
  const failAlertDialog = useRef<AlertDialogRef>(null)
  const {
    isUserLoser,
    isLoading,
    lastWeekTier,
    lastWeekRankingPodium,
    handleAlertDialogButtonClick,
    handleWRankingResultButtonClick,
  } = useRankingResult({
    rewardAlertDialog,
    successAlertDialog,
    failAlertDialog,
  })
  const { user } = useAuthContext()
  const api = useApi()
  const tierImage = user ? api.fetchImage('rankings', user.tier.image.value) : ''
  console.log(user?.tier.image.value)

  if (isLoading) return <Loading isSmall={false} />

  if (user && lastWeekRankingPodium)
    return (
      <div>
        <h2 className='text-center text-lg font-semibold text-gray-100'>
          Resultado da última semana
        </h2>

        <div className='mt-6 flex items-end justify-center gap-6'>
          {lastWeekRankingPodium.winners.map((winner) => (
            <RankingWinner
              key={winner.id}
              xp={winner.xp.value}
              name={winner.name.value}
              avatarImage={winner.avatar.image.value}
              avatarName={winner.avatar.name.value}
              position={winner.rankingPosition.position.value}
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
                  Que pena! Você ficou em {user.lastWeekRankingPosition.position.value}º
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
                Parabéns! Você ficou em {user.lastWeekRankingPosition.position.value}º no
                ranking da última semana 🎉!
              </p>
            )}

            {user.isTopRankingWinner && (
              <AlertDialog
                ref={rewardAlertDialog}
                type='earning'
                title='Recompensa resgatada!'
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
          type='earning'
          title='Novo tier!'
          body={
            <div className='flex flex-col items-center justify-center gap-6'>
              <p className='mt-3 text-center text-gray-100'>
                Parabéns! Você acaba de chegar no tier:
                <br />
                <span className='text-lg font-medium text-green-500'>
                  {user.tier.name.value}
                </span>
              </p>

              <div className='relative flex justify-center w-full'>
                <span className='absolute -top-10 z-0'>
                  <Animation name='shinning' size={140} />
                </span>

                <div>
                  <Image
                    src={tierImage}
                    width={80}
                    height={80}
                    alt={user.tier.name.value}
                    className='z-20'
                  />
                </div>
              </div>

              <p className='text-gray-100 mt-1'>
                Você ganhou{' '}
                <strong className='text-green-400 font-semibold'>
                  {user.rewardByLastWeekRankingPosition}
                </strong>{' '}
                de starcoins por esse feito!
              </p>
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
            title={'Perda de Tier!'}
            body={
              <div className='mt-3 flex flex-col items-center justify-center gap-3'>
                <p className='text-center text-gray-100'>
                  Puxa vida, parece que você desceu para o tier:
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
