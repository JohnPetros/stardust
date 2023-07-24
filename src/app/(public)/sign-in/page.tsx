'use client'
import { useEffect, useRef } from 'react'
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

import { motion, Variants } from 'framer-motion'
import { PASSWORD_REGEX } from '@/utils/constants/password-regex'

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

  const formVariants: Variants = {
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

  async function handleFormData({ email, password }: FormFields) {
    const response = await signIn(email, password)

    if (response === 'Invalid login credentials') {
      toastRef.current?.open({
        type: 'error',
        message: 'Usuário não encontrado',
      })
    }
  }

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user])

  return (
    <>
      <Toast ref={toastRef} />

      <div className="h-screen lg:grid lg:grid-cols-[1fr_1.5fr]">
        <main className="flex flex-col items-center justify-center h-full">
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
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
        </main>

        <div className="bg-gray-800 hidden lg:grid lg:place-content-center">
          <Hero />
        </div>
      </div>
    </>
  )
}
