'use client'

import { Button } from '@/modules/global/components/shared/Button'
import { Input } from '@/modules/global/components/shared/Input'

import { Hero } from '../../shared/Hero'
import { Link } from '../../shared/Link'
import { Title } from '../../shared/Title'
import { AnimatedForm } from '../../shared/AnimatedForm'

import { useSignUpPage } from './useSignUpPage'

export function SignUpPage() {
  const { errors, isLoading, register, handleSubmit } = useSignUpPage()

  return (
    <div className='h-screen lg:grid lg:grid-cols-[1fr_1.5fr]'>
      <main className='flex h-full flex-col items-center justify-center'>
        <AnimatedForm isVisible={true}>
          <Title
            title='Faça seu cadastro'
            text='Insira suas informações para cadastrar'
          />
          <form onSubmit={handleSubmit} className='mt-4'>
            <div className='space-y-4'>
              <Input
                label='Nome de usuário'
                type='text'
                icon='lock'
                placeholder='Digite seu nome de usuário'
                autoFocus
                {...register('name')}
                error={errors.name?.message}
              />
              <Input
                label='E-mail'
                type='email'
                icon='mail'
                placeholder='Digite seu e-mail'
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label='Senha'
                type='password'
                icon='lock'
                placeholder='Digite sua senha'
                {...register('password')}
                error={errors.password?.message}
              />
              <Input
                label='Confirmação de Senha'
                type='password'
                icon='lock'
                placeholder='Confirme sua senha'
                {...register('password_confirmation')}
                error={errors.password_confirmation?.message}
              />
            </div>
            <div className='mt-6'>
              <Button className='' isLoading={isLoading}>
                Cadastrar
              </Button>
            </div>
          </form>
          <div className='mt-3 flex w-full items-center justify-center'>
            <Link href='/sign-in'>Já tenho uma conta</Link>
          </div>
        </AnimatedForm>
      </main>

      <div className='hidden bg-gray-800 lg:grid lg:place-content-center'>
        <Hero />
      </div>
    </div>
  )
}
