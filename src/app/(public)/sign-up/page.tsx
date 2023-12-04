'use client'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Envelope, Lock } from '@phosphor-icons/react'
import { motion, Variants } from 'framer-motion'

import { Hero } from '../components/Hero'
import { Link } from '../components/Link'
import { Title } from '../components/Title'

import { SignUpError } from '@/@types/signUpError'
import { Button } from '@/app/components/Button'
import { Input } from '@/app/components/Input'
import { Toast, ToastRef } from '@/app/components/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { SignUpFormFields, signUpFormSchema } from '@/libs/zod'
import { useApi } from '@/services/api'
import { SIGN_UP_ERRORS } from '@/utils/constants/signup-errors'

const formAnimations: Variants = {
  hidden: {
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
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormFields>({
    resolver: zodResolver(signUpFormSchema),
  })

  const [isLoading, setIsLoading] = useState(false)

  const { signUp } = useAuth()

  const api = useApi()

  const toastRef = useRef<ToastRef>(null)

  function handleError(error: SignUpError) {
    console.error(error)
    const message = SIGN_UP_ERRORS[error] ?? 'Erro ao tentar fazer cadastro'

    toastRef.current?.open({
      type: 'error',
      message,
    })
  }

  async function handleFormData({ name, email, password }: SignUpFormFields) {
    setIsLoading(true)
    let userEmail

    try {
      userEmail = await api.getUserEmail(email)
    } catch (error) {
      toastRef.current?.open({
        type: 'error',
        message: 'Usuário não encontrado',
      })
    } finally {
      setIsLoading(false)
    }

    if (userEmail) {
      toastRef.current?.open({
        type: 'error',
        message: 'Usuário já registrado com esse e-mail',
      })
      return
    }

    try {
      const response = await signUp(email, password)

      if (response?.error) {
        handleError(response?.error.message as SignUpError)
        return
      }

      toastRef.current?.open({
        type: 'success',
        message: 'Verifique seu e-mail para confirmar o seu cadastro',
        seconds: 5,
      })

      if (response?.userId) {
        console.log({ userEmail })

        await api.addUser({ id: response.userId, name, email })
      }
    } catch (error) {
      console.error({ error })
      toastRef.current?.open({
        type: 'error',
        message: 'Erro ao ',
      })
    } finally {
      setIsLoading(false)
    }

    toastRef.current?.open({
      type: 'success',
      message: 'Confira seu e-mail para confirmar seu cadastro',
    })
  }

  return (
    <>
      <Toast ref={toastRef} />

      <div className="h-screen lg:grid lg:grid-cols-[1fr_1.5fr]">
        <main className="flex h-full flex-col items-center justify-center">
          <motion.div
            variants={formAnimations}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[320px]"
          >
            <Title
              title="Faça seu cadastro"
              text="Insira suas informações para cadastrar"
            />
            <form
              action="/"
              onSubmit={handleSubmit(handleFormData)}
              className="mt-4"
            >
              <div className="space-y-4">
                <Input
                  label="Nome de usuário"
                  type="text"
                  icon={Lock}
                  placeholder="Digite seu nome de usuário"
                  autoFocus
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="E-mail"
                  type="email"
                  icon={Envelope}
                  placeholder="Digite seu e-mail"
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
                <Input
                  label="Confirmação de Senha"
                  type="password"
                  icon={Lock}
                  placeholder="Confirme sua senha"
                  {...register('password_confirmation')}
                  error={errors.password_confirmation?.message}
                />
              </div>
              <div className="mt-6">
                <Button className="" isLoading={isLoading}>
                  Cadastrar
                </Button>
              </div>
            </form>
            <div className="mt-4 flex w-full items-center justify-center">
              <Link href="/sign-in">Já tenho uma conta</Link>
            </div>
          </motion.div>
        </main>

        <div className="hidden bg-gray-800 lg:grid lg:place-content-center">
          <Hero />
        </div>
      </div>
    </>
  )
}
