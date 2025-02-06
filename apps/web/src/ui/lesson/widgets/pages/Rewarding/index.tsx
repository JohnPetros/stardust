'use client'

import { useRef } from 'react'

import { Datetime } from '@stardust/core/libs'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import { WeekStatus } from '@stardust/core/profile/structs'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { Button } from '@/ui/global/widgets/components/Button'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Benchmark } from '@/ui/global/widgets/components/Button/Benchmark'
import { StreakIcon } from '@/ui/global/widgets/components/StreakIcon'
import { StreakBoard } from '@/ui/global/widgets/components/StreakBoard'
import { AnimatedApolloMessage } from './AnimatedApolloMessage'
import { AnimatedEndMessage } from './AnimatedEndMessage'
import { AnimatedButton } from './AnimatedButton'
import { useRewardingPage } from './useRewardingPage'

export type RewardingPageProps = {
  newCoins: number
  newXp: number
  newLevel: number | null
  newStreak: number | null
  newWeekStatus: WeekStatusValue | null
  secondsCount: number
  accuracyPercentage: number
  nextRoute: string
}

export function RewardingPage({
  newCoins,
  newLevel,
  newXp,
  newStreak,
  newWeekStatus,
  secondsCount,
  accuracyPercentage,
  nextRoute,
}: RewardingPageProps) {
  const newLevelAlertDialogRef = useRef<AlertDialogRef>(null)
  const {
    isEndMessageVisible,
    isFirstClick,
    isLoading,
    isStreakVisible,
    handleFirstButtonClick,
    handleSecondButtonClick,
    handleNewLevelAlertDialogOpenChange,
  } = useRewardingPage({ newLevel, newStreak, nextRoute, newLevelAlertDialogRef })

  return (
    <div className='mx-auto flex h-screen w-full max-w-lg flex-col items-center justify-center px-6'>
      <div className='my-auto flex flex-col items-center justify-center'>
        {!isStreakVisible && !isEndMessageVisible && (
          <>
            <h1 className='text-xl font-semibold text-gray-100'>Fase completada!</h1>
            <AnimatedApolloMessage>
              <Animation name='apollo-congratulating' size={280} hasLoop />
            </AnimatedApolloMessage>
            <dl className='mt-3 flex flex-col items-center justify-center'>
              <div className='mx-auto'>
                <Benchmark
                  title='Poeira estelar'
                  amount={newCoins}
                  color='yellow'
                  icon='coin.svg'
                  isLarge={true}
                  delay={1}
                />
              </div>

              <div className='mt-6 grid grid-cols-3 gap-3'>
                <Benchmark
                  title='Total de xp'
                  amount={newXp}
                  color='green'
                  icon='xp.svg'
                  isLarge={false}
                  delay={1.5}
                />

                <Benchmark
                  title='Tempo'
                  amount={new Datetime().convertSecondsToTime(secondsCount)}
                  color='blue'
                  icon='clock.svg'
                  isLarge={false}
                  delay={2}
                />

                <Benchmark
                  title='Acertos'
                  amount={`${accuracyPercentage}%`}
                  color='red'
                  icon='percent.svg'
                  isLarge={false}
                  delay={2.5}
                />
              </div>
            </dl>
          </>
        )}

        {isStreakVisible && newStreak && newWeekStatus && (
          <>
            <StreakIcon size={220} />
            <StreakBoard
              weekStatus={WeekStatus.create(newWeekStatus)}
              streakCount={newStreak}
            />
          </>
        )}

        {isEndMessageVisible && (
          <AnimatedEndMessage>
            <span className='text-center text-2xl font-semibold text-white'>
              Parabéns, continue assim 😉!
            </span>
          </AnimatedEndMessage>
        )}
      </div>

      <AnimatedButton>
        <Button
          isLoading={isLoading}
          onClick={isFirstClick ? handleFirstButtonClick : handleSecondButtonClick}
          className='mb-16 w-80'
        >
          Continuar
        </Button>
      </AnimatedButton>

      <AlertDialog
        ref={newLevelAlertDialogRef}
        type='earning'
        title={'Parabéns! Você alcançou um novo nível!'}
        body={
          <div className='mb-6 space-y-1 text-center text-gray-100'>
            <p>
              Você acaba de chegar no{' '}
              <span className='text-medium text-lg text-green-400'>
                Nível {newLevel} 😀
              </span>
              .
            </p>
            <p>Continue assim!</p>
          </div>
        }
        action={<Button>Show!</Button>}
        onOpenChange={handleNewLevelAlertDialogOpenChange}
      />
    </div>
  )
}
