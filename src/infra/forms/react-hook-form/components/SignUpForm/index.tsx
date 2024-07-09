'use client'

import { Input } from '@/modules/global/components/shared/Input'
import { Button } from '@/modules/global/components/shared/Button'
import type { SignUpFormFields } from '@/infra/forms/types'

import { useSignUpForm } from './useSignUpForm'
import { AnimatedContainer } from './AnimatedContainer'

type SignUpFormProps = {
  id: string
  onSubmit: (fields: SignUpFormFields) => Promise<void>
}

export function SignUpForm({ id, onSubmit }: SignUpFormProps) {
  const {
    errors,
    isLoading,
    isNameValid,
    isEmailValid,
    isPasswordValid,
    register,
    handleSubmit,
  } = useSignUpForm(onSubmit)

  return (
    <form aria-label={id} onSubmit={handleSubmit} className='mt-4'>
      <div className='space-y-4'>
        <AnimatedContainer>
          <Input
            label='Nome de usuário'
            type='text'
            icon='lock'
            placeholder='Digite seu nome de usuário'
            isActive={isNameValid}
            autoFocus
            {...register('name')}
            error={errors.name?.message}
          />
        </AnimatedContainer>
        {isNameValid && (
          <AnimatedContainer>
            <Input
              label='E-mail'
              type='email'
              icon='mail'
              placeholder='Digite seu e-mail'
              isActive={isEmailValid}
              {...register('email')}
              error={errors.email?.message}
            />
          </AnimatedContainer>
        )}

        {isEmailValid && (
          <AnimatedContainer>
            <div className='space-y-4'>
              <Input
                label='Senha'
                type='password'
                icon='lock'
                placeholder='Digite sua senha'
                isActive={isPasswordValid}
                {...register('password')}
                error={errors.password?.message}
              />
              {!isPasswordValid && (
                <p className='text-gray-100 text-sm tracking-wider leading-4'>
                  Sua senha deve conter pelo menos 6 caracteres, uma letra minúscula, uma
                  maiúscula, um número e um caractere especial 😙.
                </p>
              )}
            </div>
          </AnimatedContainer>
        )}
      </div>
      {isPasswordValid && (
        <AnimatedContainer>
          <Button className='mt-6' isLoading={isLoading}>
            Criar conta
          </Button>
        </AnimatedContainer>
      )}
    </form>
  )
}
