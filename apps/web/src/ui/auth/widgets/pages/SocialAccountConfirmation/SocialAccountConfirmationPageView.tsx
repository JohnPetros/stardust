import type { RefObject } from 'react'
import { AnimatePresence } from 'framer-motion'

import type { UserDto } from '@stardust/core/profile/entities/dtos'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Button } from '@/ui/global/widgets/components/Button'
import { AppMessage } from '../../components/AppMessage'
import { RocketAnimation } from '../../components/RocketAnimation'

type Props = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  isRocketVisible: boolean
  user: UserDto | null
  isNewAccount: boolean
  onLinkClick: () => void
}

export const SocialAccountConfirmationPageView = ({
  rocketAnimationRef,
  isRocketVisible,
  user,
  isNewAccount,
  onLinkClick,
}: Props) => {
  return (
    <>
      <RocketAnimation animationRef={rocketAnimationRef} isVisible={isRocketVisible} />

      <AnimatePresence>
        {!isRocketVisible && (
          <main className='flex h-full w-full items-center justify-center'>
            {user && !isNewAccount ? (
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
              <Loading />
            )}
          </main>
        )}
      </AnimatePresence>
    </>
  )
}
