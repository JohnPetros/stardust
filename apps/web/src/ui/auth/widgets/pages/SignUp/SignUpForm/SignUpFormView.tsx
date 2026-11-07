'use client'

import type { BaseSyntheticEvent } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import { Input } from '@/ui/global/widgets/components/Input'
import { Button } from '@/ui/global/widgets/components/Button'
import { AnimatedContainer } from './AnimatedContainer'

type SignUpFormFields = {
  name: string
  email: string
  password: string
}

export type SignUpFormViewProps = {
  errors: FieldErrors<SignUpFormFields>
  isNameValid: boolean
  isEmailValid: boolean
  isPasswordValid: boolean
  isSubmitting: boolean
  register: UseFormRegister<SignUpFormFields>
  handleSubmit: (event?: BaseSyntheticEvent) => Promise<void>
}

export const SignUpFormView = ({
  errors,
  isNameValid,
  isEmailValid,
  isPasswordValid,
  isSubmitting,
  register,
  handleSubmit,
}: SignUpFormViewProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className='space-y-4'>
        <AnimatedContainer>
          <Input
            testId='name-input'
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
            <p
              data-testid='name-input-error'
              className='mt-3 text-sm text-theme-text-secondary'
            >
              Pelo menos 3 caracteres
            </p>
          )}
        </AnimatedContainer>
        {isNameValid && (
          <AnimatedContainer>
            <Input
              testId='email-input'
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
              <p
                data-testid='email-input-error'
                className='mt-3 text-sm text-theme-text-secondary'
              >
                E-mail válido, por favor
              </p>
            )}
          </AnimatedContainer>
        )}

        {isEmailValid && (
          <AnimatedContainer>
            <div className='space-y-4'>
              <Input
                testId='password-input'
                label='Senha'
                type='password'
                icon='lock'
                placeholder='Digite sua senha'
                isActive={isPasswordValid}
                {...register('password')}
              />
              {!isPasswordValid && (
                <p
                  data-testid='password-input-error'
                  className='text-sm leading-6 tracking-wider text-theme-text-secondary'
                >
                  Senha deve conter pelo menos 6 caracteres 😙.
                </p>
              )}
            </div>
          </AnimatedContainer>
        )}
      </div>
      {isPasswordValid && (
        <AnimatedContainer>
          <Button
            testId='submit-button'
            type='submit'
            className='mt-6'
            isLoading={isSubmitting}
          >
            Criar conta
          </Button>
        </AnimatedContainer>
      )}
    </form>
  )
}
