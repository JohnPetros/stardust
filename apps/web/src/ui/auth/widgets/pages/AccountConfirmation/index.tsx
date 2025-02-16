'use client'

import { useRef } from 'react'
import { AnimatePresence } from 'framer-motion'

import { AppMessage } from '@/ui/auth/widgets/components/AppMessage'
import { Loading } from '@/ui/global/widgets/components/Loading'

import { useAccountConfirmationPage } from './useAccountConfirmationPage'
import { RocketAnimation } from '../../components/RocketAnimation'
import { Button } from '@/ui/global/widgets/components/Button'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

export function AccountConfirmationPage() {
  const rocketAnimationRef = useRef<AnimationRef>(null)

  const { isRocketVisible, user, handleLinkClick } =
    useAccountConfirmationPage(rocketAnimationRef)

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
                  <Button onClick={handleLinkClick} className='w-72'>
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
