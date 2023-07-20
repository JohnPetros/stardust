'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Envelope, Lock } from '@phosphor-icons/react'
import { Title } from '../components/Title'
import { Hero } from '../components/Hero'
import { Link } from '../components/Link'
import { Input } from '@/app/components/Input'
import { Button } from '@/app/components/Button'
import { motion, Variants } from 'framer-motion'
import { PASSWORD_REGEX } from '@/constants/password-regex'

const formSchema = z.object({
  email: z
    .string()
    .nonempty('Seu e-mail não pode estar vazio!')
    .email('Por favor informe um e-mail válido!'),
  password: z.string().nonempty('Sua senha não pode estar vazia!').regex(
    PASSWORD_REGEX,
    'Senha deve conter pelo menos uma letra minúscula, uma maiúscula, um dígito e um caractere especial.'
  ),
})

export type FormFields = z.infer<typeof formSchema>

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

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

  return (
    <div className="h-screen lg:grid lg:grid-cols-[1fr_1.5fr]">
      <main className="flex flex-col items-center justify-center h-full">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[320px]"
        >
          <Title
            title="Faça seu cadastro"
            text="Insira suas informações para cadastrar"
          />
          <form action="/" className="mt-8">
            <div className="space-y-4">
              <Input
                label="Nome de usuário"
                type="text"
                icon={Lock}
                name="password"
                placeholder="Digite seu nome de usuário"
                autoFocus
              />
              <Input
                label="E-mail"
                type="email"
                icon={Envelope}
                name="email"
                placeholder="Digite seu e-mail"
              />
              <Input
                label="Senha"
                type="password"
                icon={Lock}
                name="password"
                placeholder="Digite senha"
              />
              <Input
                label="Confirmação de Senha"
                type="password"
                icon={Lock}
                name="password-confirmation"
                placeholder="Confirme sua senha"
              />
            </div>
            <div className="mt-6">
              <Button className="">Entrar</Button>
            </div>
          </form>
          <div className="flex items-center justify-center w-full mt-4">
            <Link href="/sign-in">Já tenho uma conta</Link>
          </div>
        </motion.div>
      </main>

      <div className="bg-gray-800 hidden lg:grid lg:place-content-center">
        <Hero />
      </div>
    </div>
  )
}
