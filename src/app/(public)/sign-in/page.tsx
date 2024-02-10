'use client'
import { Envelope, Lock } from '@phosphor-icons/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'

import { Hero } from '../components/Hero'
import { Link } from '../components/Link'
import { RocketAnimation } from '../components/RocketAnimation'
import { Title } from '../components/Title'

import { useSignInForm } from './useSignInForm'

import { Button } from '@/global/components/Button'
import { Input } from '@/global/components/Input'
import { ROUTES } from '@/global/constants'

const formAnimations: Variants = {
  initial: {
    opacity: 0,
    x: -250,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      duration: 0.4,
    },
  },
  hidden: {
    opacity: 0,
    x: -750,
    transition: {
      duration: 2,
    },
  },
}

const heroAnimations: Variants = {
  hidden: {
    opacity: 0,
    x: '75vw',
    transition: {
      duration: 2,
    },
  },
}

export default function SignInPage() {
  const {
    errors,
    isLaoding,
    isRocketVisible,
    rocketRef,
    register,
    handleSubmit,
  } = useSignInForm()

  return (
    <>
      <RocketAnimation animationRef={rocketRef} isVisible={isRocketVisible} />

      <div className="h-screen lg:grid lg:grid-cols-[1fr_1.5fr]">
        <main className="flex h-full flex-col items-center justify-center">
          <AnimatePresence>
            {!isRocketVisible && (
              <motion.div
                variants={formAnimations}
                initial="initial"
                animate="visible"
                exit="hidden"
                className="w-full max-w-[320px]"
              >
                <Title
                  title="Entre na sua conta"
                  text="Insira suas informações de cadastro."
                />
                <form action="/" onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    <Input
                      label="E-mail"
                      type="email"
                      icon={Envelope}
                      placeholder="Digite seu e-mail"
                      autoFocus
                      {...register('email')}
                      error={errors.email?.message}
                    />
                    <Input
                      label="Senha"
                      type="password"
                      icon={Lock}
                      placeholder="Digite sua senha"
                      {...register('password')}
                      error={errors.password?.message}
                    />
                  </div>
                  <div className="mt-6">
                    <Button name="submit" type="submit" isLoading={isLaoding}>
                      Entrar
                    </Button>
                  </div>
                </form>
                {/* <Button
                  name="submit"
                  type="submit"
                  onClick={() => handleOAuth('github')}
                >
                  Entrar com github
                </Button> */}
                <div className="mt-4 flex w-full items-center justify-between">
                  <Link href={ROUTES.public.resetPassword}>
                    Esqueci a senha
                  </Link>
                  <Link href={ROUTES.public.signUp}>Criar conta</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {!isRocketVisible && (
            <motion.div
              variants={heroAnimations}
              exit="hidden"
              className="hidden bg-gray-800 lg:grid lg:place-content-center"
            >
              <Hero />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
