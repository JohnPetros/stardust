'use client'
import { useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Envelope, Lock } from '@phosphor-icons/react'
import { Title } from '../components/Title'
import { Hero } from '../components/Hero'
import { Link } from '../components/Link'
import { Input } from '@/app/components/Input'
import { Button } from '@/app/components/Button'
import { Toast, ToastRef } from '@/app/components/Toast'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import { PASSWORD_REGEX } from '@/utils/constants/password-regex'

import RocketLaunching from '../../../../public/animations/rocket-launching.json'
import Lottie, { LottieRef } from 'lottie-react'
const ROCKET_DURATION = 1.2 // seconds

const formVariants: Variants = {
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
      duration: ROCKET_DURATION,
    },
  },
}

const heroVariants: Variants = {
  hidden: {
    opacity: 0,
    x: '75vw',
    transition: {
      duration: ROCKET_DURATION,
    },
  },
}

const rocketLaunchingVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: ROCKET_DURATION,
      duration: 0.4,
    },
  },
}

const formSchema = z.object({
  email: z
    .string()
    .nonempty('Seu e-mail não pode estar vazio!')
    .email('Por favor informe um e-mail válido!'),
  password: z
    .string()
    .nonempty('Sua senha não pode estar vazia!')
    .regex(
      PASSWORD_REGEX,
      'Senha deve conter pelo menos uma letra minúscula, uma maiúscula, um dígito e um caractere especial.'
    ),
})

export type FormFields = z.infer<typeof formSchema>

export default function SignIn() {
  const [isRocketVisible, setIsRocketVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  const { signIn, user, isLoading } = useAuth()

  const router = useRouter()

  const toastRef = useRef<ToastRef>(null)
  const rocketRef = useRef(null) as LottieRef

  function handleRocketLanchingEnd() {
    rocketRef.current?.pause()

    if (user) {
      console.log(user.id)
    }
  }

  async function launchRocket() {
    return await new Promise((resolve) =>
      setTimeout(() => {
        rocketRef.current?.goToAndPlay(0)
        resolve(true)
      }, ROCKET_DURATION + 1000)
    )
  }

  async function handleFormData({ email, password }: FormFields) {
    const response = await signIn(email, password)

    if (response === 'Invalid login credentials') {
      toastRef.current?.open({
        type: 'error',
        message: 'Usuário não encontrado',
      })
      return
    }

    setIsRocketVisible(true)

    await launchRocket()
  }

  return (
    <>
      <Toast ref={toastRef} />

      <motion.div
        variants={rocketLaunchingVariants}
        initial="hidden"
        animate={isRocketVisible ? 'visible' : ''}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Lottie
          lottieRef={rocketRef}
          animationData={RocketLaunching}
          style={{ width: 640, height: 640 }}
          loop={false}
          onComplete={handleRocketLanchingEnd}
        />
      </motion.div>

      <div className="h-screen lg:grid lg:grid-cols-[1fr_1.5fr]">
        <main className="flex flex-col items-center justify-center h-full">
          <AnimatePresence>
            {!isRocketVisible && (
              <motion.div
                variants={formVariants}
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
                      placeholder="Digite senha"
                      {...register('password')}
                      error={errors.password?.message}
                    />
                  </div>
                  <div className="mt-6">
                    <Button type="submit" isLoading={isLoading}>
                      Entrar
                    </Button>
                  </div>
                </form>
                <div className="flex items-center justify-between w-full mt-4">
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
              variants={heroVariants}
              exit="hidden"
              className="bg-gray-800 hidden lg:grid lg:place-content-center"
            >
              <Hero />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
