'use client'

import { Input } from '@/ui/global/widgets/components/Input'
import { Button } from '@/ui/global/widgets/components/Button'

import { useSignUpForm } from './useSignUpForm'
import { AnimatedContainer } from './AnimatedContainer'
import type { ProfileService } from '@stardust/core/profile/interfaces'

type Props = {
  id: string
  isSubmitting: boolean
  profileService: ProfileService
  onSubmit: (email: string, password: string, name: string) => Promise<void>
}

export const SignUpFormView = ({ id, profileService, isSubmitting, onSubmit }: Props) => {
  const { errors, isNameValid, isEmailValid, isPasswordValid, register, handleSubmit } =
    useSignUpForm(profileService, onSubmit)

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
            errorMessage={
              errors.name?.message === 'Nome já utilizado por outro usuário'
                ? errors.name?.message
                : ''
            }
            {...register('name')}
          />
          {!isNameValid && (
            <p className='text-gray-100 text-sm mt-3'>Pelo menos 3 caracteres</p>
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
              errorMessage={
                errors.email?.message === 'E-mail já utilizado por outro usuário'
                  ? errors.email?.message
                  : ''
              }
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
                  Senha deve conter pelo menos 6 caracteres 😙.
                </p>
              )}
            </div>
          </AnimatedContainer>
        )}
      </div>
      {isPasswordValid && (
        <AnimatedContainer>
          <Button type='submit' className='mt-6' isLoading={isSubmitting}>
            Criar conta
          </Button>
        </AnimatedContainer>
      )}
    </form>
  )
}
