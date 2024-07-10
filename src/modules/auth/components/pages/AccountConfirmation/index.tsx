'use client'

import { useRef } from 'react'
import { AnimatePresence } from 'framer-motion'

import { AppMessage } from '@/modules/auth/components/shared/AppMessage'
import { Button } from '@/modules/global/components/shared/Button'
import { Loading } from '@/modules/global/components/shared/Loading'
import type { AnimationRef } from '@/modules/global/components/shared/Animation/types'

import { useAccountConfirmationPage } from './useAccountConfirmationPage'
import { RocketAnimation } from '../../shared/RocketAnimation'

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
