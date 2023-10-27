'use client'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Envelope, Lock } from '@phosphor-icons/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { LottieRef } from 'lottie-react'
import { useRouter } from 'next/navigation'

import { Hero } from '../components/Hero'
import { Link } from '../components/Link'
import { RocketAnimation } from '../components/RocketAnimation'
import { Title } from '../components/Title'

import { Button } from '@/app/components/Button'
import { Input } from '@/app/components/Input'
import { Toast, ToastRef } from '@/app/components/Toast'
import { useAuth } from '@/hooks/useAuth'
import { SignInFormFields, signInFormSchema } from '@/libs/zod'
import { ROCKET_ANIMATION_DURATION } from '@/utils/constants'

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
      duration: ROCKET_ANIMATION_DURATION,
    },
  },
}

const heroAnimations: Variants = {
  hidden: {
    opacity: 0,
    x: '75vw',
    transition: {
      duration: ROCKET_ANIMATION_DURATION,
    },
  },
}

export default function SignIn() {
  const [isRocketVisible, setIsRocketVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormFields>({
    resolver: zodResolver(signInFormSchema),
  })

  const { signIn } = useAuth()
  const [isLaoding, setIsLoading] = useState(false)

  const router = useRouter()

  const toastRef = useRef<ToastRef>(null)
  const rocketRef = useRef(null) as LottieRef

  async function launchRocket() {
    await new Promise((resolve) =>
      setTimeout(() => {
        rocketRef.current?.goToAndPlay(0)
        resolve(true)
      }, ROCKET_ANIMATION_DURATION * 1000)
    )
  }

  async function handleFormData({ email, password }: SignInFormFields) {
    const error = await signIn(email, password)

    if (error) {
      if (error === 'Invalid login credentials') {
        toastRef.current?.open({
          type: 'error',
          message: 'Usuário não encontrado',
        })
        return
      }

      console.error(error)
      return
    }

    setIsLoading(true)

    setIsRocketVisible(true)

    await launchRocket()

    setTimeout(() => {
      router.push('/')
    }, ROCKET_ANIMATION_DURATION * 2500)
  }

  return (
    <>
      <Toast ref={toastRef} />

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
                <form
                  action="/"
                  onSubmit={handleSubmit(handleFormData)}
                  className="mt-4"
                >
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
                <div className="mt-4 flex w-full items-center justify-between">
                  <Link href="/forgot-password">Esqueci a senha</Link>
                  <Link href="/sign-up">Criar conta</Link>
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
