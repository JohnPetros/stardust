'use client'
import { EnvelopeSimple } from '@phosphor-icons/react'
import { motion, Variants } from 'framer-motion'

import { useResetPasswordForm } from './useResetPasswordForm'

import { Link } from '@/app/(public)/components/Link'
import { Button } from '@/app/components/Button'
import { Input } from '@/app/components/Input'
import { Toast } from '@/app/components/Toast'
import { ROUTES } from '@/utils/constants'

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

export function ResetPassordForm() {
  const { isLoading, email, error, toastRef, handleEmailChange, handleSubmit } =
    useResetPasswordForm()

  return (
    <>
      <Toast ref={toastRef} />
      <div className="flex h-full w-full items-center justify-center ">
        <motion.form
          variants={formAnimations}
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-[24rem] flex-col gap-8"
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
      </div>
    </>
  )
}
