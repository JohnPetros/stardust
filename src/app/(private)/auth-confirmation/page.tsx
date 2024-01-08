'use client'

import { AnimatePresence } from 'framer-motion'

import { useEmailConfirmationPage } from './useEmailConfirmationPage'

import { RocketAnimation } from '@/app/(public)/components/RocketAnimation'
import { AppMessage } from '@/app/components/AppMessage'
import { Button } from '@/app/components/Button'
import { Loading } from '@/app/components/Loading'

export default function EmailConfirmationPage() {
  const { isRocketVisible, rocketRef, user, handleHomeLink } =
    useEmailConfirmationPage()

  return (
    <>
      <RocketAnimation animationRef={rocketRef} isVisible={isRocketVisible} />
      <AnimatePresence>
        {!isRocketVisible && (
          <section className="flex h-full w-full items-center justify-center">
            {user ? (
              <AppMessage
                title="Bem-vindo(a) 👋"
                subtitle="Seu perfil foi criado com sucesso!"
                footer={
                  <Button onClick={handleHomeLink}>Ir para página Home</Button>
                }
              />
            ) : (
              <Loading />
            )}
          </section>
        )}
      </AnimatePresence>
    </>
  )
}