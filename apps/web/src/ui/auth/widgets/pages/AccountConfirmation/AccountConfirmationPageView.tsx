import type { RefObject } from 'react'
import { AnimatePresence } from 'motion/react'

import { AppMessage } from '@/ui/auth/widgets/components/AppMessage'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Button } from '@/ui/global/widgets/components/Button'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import { UserCreationPendingMessage } from '../SocialAccountConfirmation/UserCreationPendingMessage'

import { RocketAnimation } from '../../components/RocketAnimation'

type Props = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  isRocketVisible: boolean
  isRetryVisible: boolean
  isRetryingUserCreation: boolean
  user: UserDto | null
  onLinkClick: () => void | Promise<void>
  onRetryUserCreation: () => void | Promise<void>
}

export function AccountConfirmationPageView({
  rocketAnimationRef,
  isRocketVisible,
  isRetryVisible,
  isRetryingUserCreation,
  user,
  onLinkClick,
  onRetryUserCreation,
}: Props) {
  return (
    <>
      <RocketAnimation animationRef={rocketAnimationRef} isVisible={isRocketVisible} />

      <AnimatePresence>
        {!isRocketVisible && (
          <main className='flex h-full w-full items-center justify-center'>
            {user ? (
              <AppMessage
                title='Bem-vindo(a) 👋'
                subtitle='Seu perfil foi criado com sucesso!'
                footer={
                  <Button onClick={onLinkClick} className='w-72'>
                    Ir para a página principal
                  </Button>
                }
              />
            ) : (
              <div className='flex flex-col items-center justify-center'>
                <Loading />
                <UserCreationPendingMessage />
                {isRetryVisible && (
                  <Button
                    onClick={onRetryUserCreation}
                    isLoading={isRetryingUserCreation}
                    className='mt-8 w-72'
                  >
                    Tentar novamente
                  </Button>
                )}
              </div>
            )}
          </main>
        )}
      </AnimatePresence>
    </>
  )
}
