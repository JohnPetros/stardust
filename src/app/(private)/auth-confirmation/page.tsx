'use client'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import Lottie from 'lottie-react'

import Animation from '../../../../public/animations/apollo-asking.json'

import { useEmailConfirmationPage } from './useEmailConfirmationPage'

import { RocketAnimation } from '@/app/(public)/components/RocketAnimation'
import { Button } from '@/app/components/Button'
import { Loading } from '@/app/components/Loading'

const sectionAnimations: Variants = {
  hidden: {
    opacity: 0,
    y: -150,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

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
              <motion.div
                variants={sectionAnimations}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  type: 'spring',
                  duration: 0.8,
                }}
                className="z-50 mx-auto max-w-[36rem] space-y-4"
              >
                <Lottie
                  animationData={Animation}
                  style={{ width: 240 }}
                  loop={true}
                />
                <h1 className="text-center text-xl text-gray-50">
                  Bem-vindo(a) 👋
                </h1>
                <p className="text-center text-gray-300">
                  Seu perfil foi criado com sucesso!
                </p>
                <Button onClick={handleHomeLink}>Ir para página Home</Button>
              </motion.div>
            ) : (
              <Loading />
            )}
          </section>
        )}
      </AnimatePresence>
    </>
  )
}
