'use client'
import { EnvelopeSimple } from '@phosphor-icons/react'
import { motion, Variants } from 'framer-motion'

import { ResetPasswordDialog } from './components/ResetPasswordDialog/page'
import { useResetPassword } from './useResetPassword'

import { Link } from '@/app/(public)/components/Link'
import { AppMessage } from '@/global/components/AppMessage'
import { Button } from '@/global/components/Button'
import { Input } from '@/global/components/Input'
import { ROUTES } from '@/global/constants'

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

export default function ResetPasswordPage() {
  const {
    isLoading,
    email,
    error,
    shouldResetPassword,
    handleEmailChange,
    handleSubmit,
  } = useResetPassword()

  return (
    <div className="mx-auto flex h-full w-full max-w-[24rem] items-center justify-center px-6 md:px-0">
      {shouldResetPassword ? (
        <AppMessage
          title="Você já pode redefinir sua senha 🚀!"
          subtitle="clique no botão abaixo para redefiní-la."
          footer={
            <ResetPasswordDialog>
              <Button className="w-full">Redefinir senha</Button>
            </ResetPasswordDialog>
          }
        />
      ) : (
        <motion.form
          variants={formAnimations}
          initial="hidden"
          animate="visible"
          className="flex w-full flex-col gap-8"
          onSubmit={(event) => event.preventDefault()}
        >
          <h1 className="text-2xl font-semibold text-gray-100">
            Redefina sua senha
          </h1>
          <p className="text-sm text-gray-300">
            Digite seu e-mail de cadastro e nós enviaremos um link para você
            redefinir sua senha.
          </p>
          <Input
            label="E-mail"
            type="email"
            icon={EnvelopeSimple}
            value={email}
            onChange={({ currentTarget }) =>
              handleEmailChange(currentTarget.value)
            }
            error={error}
            placeholder="seu@email.com"
            className="w-[100rem]"
          />
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Enviar e-mail
          </Button>
          <div className="w-max self-center">
            <Link href={ROUTES.public.signIn}>
              Já tem uma conta? Faça login
            </Link>
          </div>
        </motion.form>
      )}
    </div>
  )
}
