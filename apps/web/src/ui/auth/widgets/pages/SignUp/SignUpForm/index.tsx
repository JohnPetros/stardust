'use client'

import { Input } from '@/ui/global/widgets/components/Input'
import { Button } from '@/ui/global/widgets/components/Button'

import { useSignUpForm } from './useSignUpForm'
import { AnimatedContainer } from './AnimatedContainer'
import type { SignUpFormFields } from './types'

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
            // error={errors.name?.message}
          />
          {!isNameValid && (
            <p className='text-gray-100 text-sm mt-3'>Pelo meno 3 caracteres</p>
          )}
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
            />
            {!isEmailValid && (
              <p className='text-gray-100 text-sm mt-3'>E-mail válido, por favor</p>
            )}
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
              />
              {!isPasswordValid && (
                <p className='text-gray-100 text-sm tracking-wider leading-6'>
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
