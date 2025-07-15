import type { RefObject } from 'react'
import { AnimatePresence } from 'motion/react'

import { AppMessage } from '@/ui/auth/widgets/components/AppMessage'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Button } from '@/ui/global/widgets/components/Button'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import type { UserDto } from '@stardust/core/profile/entities/dtos'

import { RocketAnimation } from '../../components/RocketAnimation'

type Props = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  isRocketVisible: boolean
  user: UserDto | null
  onLinkClick: () => void
}

export function AccountConfirmationPageView({
  rocketAnimationRef,
  isRocketVisible,
  user,
  onLinkClick,
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
              <Loading />
            )}
          </main>
        )}
      </AnimatePresence>
    </>
  )
}
