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

const formSchema = z
  .object({
    name: z
      .string()
      .nonempty('Seu nome não pode estar vazio!')
      .min(3, 'Por favor, informe um nome válido!'),
    email: z
      .string()
      .nonempty('Seu e-mail não pode estar vazio!')
      .email('Por favor, informe um e-mail válido!'),
    password: z
      .string()
      .nonempty('Sua senha não pode estar vazia!')
      .regex(
        PASSWORD_REGEX,
        'Senha deve conter pelo menos uma letra minúscula, uma maiúscula, um dígito e um caractere especial.'
      ),
    password_confirmation: z.string(),
  })
  .refine((fields) => fields.password === fields.password_confirmation, {
    path: ['password_confirmation'],
    message: 'As senhas precisam de iguais',
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

  function handleFormData(data: FormFields) {
    console.log(data)
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
                placeholder="Digite senha"
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
