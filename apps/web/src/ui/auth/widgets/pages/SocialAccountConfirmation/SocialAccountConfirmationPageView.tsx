import type { RefObject } from 'react'
import { AnimatePresence } from 'framer-motion'

import type { UserDto } from '@stardust/core/profile/entities/dtos'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Button } from '@/ui/global/widgets/components/Button'
import { AppMessage } from '../../components/AppMessage'
import { RocketAnimation } from '../../components/RocketAnimation'
import { UserCreationPendingMessage } from './UserCreationPendingMessage'

type Props = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  isRocketVisible: boolean
  isNewAccount: boolean
  isUserCreated: boolean
  onLinkClick: () => void
}

export const SocialAccountConfirmationPageView = ({
  rocketAnimationRef,
  isRocketVisible,
  isNewAccount,
  isUserCreated,
  onLinkClick,
}: Props) => {
  return (
    <>
      <RocketAnimation animationRef={rocketAnimationRef} isVisible={isRocketVisible} />

      <AnimatePresence>
        {!isRocketVisible && (
          <main className='flex h-full w-full items-center justify-center'>
            {isNewAccount && isUserCreated ? (
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
              </div>
            )}
          </main>
        )}
      </AnimatePresence>
    </>
  )
}
