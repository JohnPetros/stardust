import { Input } from '@/ui/global/widgets/components/Input'
import { Button } from '@/ui/global/widgets/components/Button'
import { ROUTES } from '@/constants'
import { Link } from '../../components/Link'
import { AnimatedForm } from './AnimatedForm'
import { ResetPasswordFormDialog } from './ResetPasswordFormDialog'
import { AppMessage } from '../../components/AppMessage'

type Props = {
  canResetPassword: boolean
  isLoading: boolean
  email: string
  errorMessage: string
  onEmailChange: (email: string) => void
  onEmailSubmit: () => void
  onNewPasswordSubmit: () => Promise<{
    accessToken: string | null
    refreshToken: string | null
  }>
  onPasswordReset: () => Promise<void>
}

export const ResetPasswordPageView = ({
  canResetPassword,
  isLoading,
  email,
  errorMessage,
  onEmailChange,
  onEmailSubmit,
  onNewPasswordSubmit,
  onPasswordReset,
}: Props) => {
  return (
    <div className='mx-auto flex h-full w-full max-w-[24rem] items-center justify-center px-6 md:px-0'>
      {canResetPassword ? (
        <AppMessage
          title='Você já pode redefinir sua senha 🚀!'
          subtitle='clique no botão abaixo para redefiní-la.'
          footer={
            <ResetPasswordFormDialog
              onNewPasswordSubmit={onNewPasswordSubmit}
              onPasswordReset={onPasswordReset}
            >
              <Button className='w-full'>Redefinir senha</Button>
            </ResetPasswordFormDialog>
          }
        />
      ) : (
        <AnimatedForm>
          <h1 className='text-2xl font-semibold text-gray-100'>Redefina sua senha</h1>
          <p className='text-sm text-gray-300'>
            Digite seu e-mail de cadastro e nós enviaremos um link para você redefinir sua
            senha.
          </p>
          <Input
            label='E-mail'
            type='email'
            icon='mail'
            value={email}
            onChange={({ currentTarget }) => onEmailChange(currentTarget.value)}
            errorMessage={errorMessage}
            placeholder='seu@email.com'
            autoFocus
            className='w-[100rem]'
          />
          <Button onClick={onEmailSubmit} isLoading={isLoading}>
            Enviar e-mail
          </Button>
          <div className='w-max self-center'>
            <Link href={ROUTES.auth.signIn}>Já tem uma conta? Faça login</Link>
          </div>
        </AnimatedForm>
      )}
    </div>
  )
}
