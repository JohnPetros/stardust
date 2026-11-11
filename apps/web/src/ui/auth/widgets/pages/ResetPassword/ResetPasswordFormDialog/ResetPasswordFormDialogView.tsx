'use client'

import type { BaseSyntheticEvent, ReactNode, RefObject } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Input } from '@/ui/global/widgets/components/Input'
import * as Dialog from '@/ui/global/widgets/components/Dialog'
import { Button } from '@/ui/global/widgets/components/Button'

type ResetPasswordFormFields = {
  password: string
  passwordConfirmation: string
}

export type ResetPasswordFormDialogViewProps = {
  children: ReactNode
  errors: FieldErrors<ResetPasswordFormFields>
  isSubmitting: boolean
  alertDialogRef: RefObject<AlertDialogRef | null>
  register: UseFormRegister<ResetPasswordFormFields>
  handleSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  onOpenChange: (isOpen: boolean) => Promise<void>
}

export const ResetPasswordFormDialogView = ({
  children,
  errors,
  isSubmitting,
  alertDialogRef,
  register,
  handleSubmit,
  onOpenChange,
}: ResetPasswordFormDialogViewProps) => {
  return (
    <>
      <AlertDialog
        type='asking'
        ref={alertDialogRef}
        title='Você redefiniu sua senha com sucesso!'
        body={
          <p className='mt-4 text-center text-base text-theme-success'>
            vamos redirecionar você para fazer login com sua nova senha
          </p>
        }
        shouldPlayAudio={false}
        shouldCloseOnInteractOutside
        onOpenChange={onOpenChange}
        action={<Button>Fazer login</Button>}
      />
      <Dialog.Container>
        <Dialog.Content>
          <Dialog.Header>Insira sua nova senha</Dialog.Header>

          <form className='mt-6'>
            <div>
              <Input
                testId='new-password-input'
                label='Nova senha'
                type='password'
                icon='lock'
                autoFocus
                {...register('password')}
                errorMessage={errors.password?.message}
                placeholder='********'
              />
            </div>
            <div className='mt-6'>
              <Input
                testId='new-password-confirmation-input'
                label='Confirme sua nova senha'
                type='password'
                icon='lock'
                {...register('passwordConfirmation')}
                errorMessage={errors.passwordConfirmation?.message}
                placeholder='********'
              />
            </div>
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className='mt-6'
              testId='reset-password-submit-button'
            >
              Redefinir senha
            </Button>
          </form>
        </Dialog.Content>
        <Dialog.Trigger>{children}</Dialog.Trigger>
      </Dialog.Container>
    </>
  )
}
