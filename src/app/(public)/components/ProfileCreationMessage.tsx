'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import Lottie from 'lottie-react'
import { LottieRef } from 'lottie-react'
import { useRouter } from 'next/navigation'

import Animation from '../../../../public/animations/apollo-asking.json'

import { RocketAnimation } from './RocketAnimation'

import { Button } from '@/app/components/Button'
import { Loading } from '@/app/components/Loading'
import { useAuth } from '@/contexts/AuthContext'
import { ROCKET_ANIMATION_DURATION, ROUTES } from '@/utils/constants'

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

export function ProfileCreationMessage() {
  const { fetchUser, user } = useAuth()
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const router = useRouter()
  const rocketRef = useRef(null) as LottieRef

  async function launchRocket() {
    await new Promise((resolve) =>
      setTimeout(() => {
        rocketRef.current?.goToAndPlay(0)
        resolve(true)
      }, ROCKET_ANIMATION_DURATION + 1000)
    )
  }

  async function handleHomeLink() {
    setIsRocketVisible(true)
    await launchRocket()
  }

  useEffect(() => {
    async function signUserIn() {
      try {
        await fetchUser()
      } catch (error) {
        console.error(error)
        router.push(ROUTES.public.signIn)
      }
    }

    signUserIn()
  }, [fetchUser, router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRocketVisible) {
      timer = setTimeout(() => {
        router.push(ROUTES.private.home)
      }, 5000)
    }

    return () => clearTimeout(timer)
  }, [isRocketVisible, router])

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
