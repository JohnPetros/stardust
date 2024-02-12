'use client'

import { Envelope, Lock } from '@phosphor-icons/react'
import { motion, Variants } from 'framer-motion'

import { Hero } from '../components/Hero'
import { Link } from '../components/Link'
import { Title } from '../components/Title'

import { useSignUpForm } from './useSignUpForm'

import { Button } from '@/global/components/Button'
import { Input } from '@/global/components/Input'
import { Separator } from '@/global/components/Separator'

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

export default function SignUpPage() {
  const { errors, isLoading, register, handleSubmit } = useSignUpForm()

  return (
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
          <form action="/" onSubmit={handleSubmit} className="mt-4">
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

            {/* <p className="mb-2 mt-3 grid grid-cols-3 items-center justify-center text-center text-xs text-gray-400">
              <Separator isColumn={false} className="bg-gray-400" />
              <span className="">ou faça login com</span>
              <Separator isColumn={false} className="bg-gray-400" />
            </p> */}
            {/* <OAuthProviders /> */}
          </form>
          <div className="mt-3 flex w-full items-center justify-center">
            <Link href="/sign-in">Já tenho uma conta</Link>
          </div>
        </motion.div>
      </main>

      <div className="hidden bg-gray-800 lg:grid lg:place-content-center">
        <Hero />
      </div>
    </div>
  )
}
