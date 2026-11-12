import { Button } from '@/ui/global/widgets/components/Button'

export type UnconfirmedEmailNoticeViewProps = {
  email: string
  isResending: boolean
  onResend: () => void
}

export const UnconfirmedEmailNoticeView = ({
  email,
  isResending,
  onResend,
}: UnconfirmedEmailNoticeViewProps) => {
  return (
    <div
      data-testid='unconfirmed-email-notice'
      role='status'
      aria-live='polite'
      className='flex flex-col gap-3 rounded-theme border border-theme-reward bg-theme-reward-surface p-4'
    >
      <p className='text-sm font-semibold leading-5 text-theme-text-primary'>
        Confirme seu e-mail para entrar
      </p>
      <p className='text-xs leading-[1.5] text-theme-text-secondary'>
        Enviamos um link de confirmação para {email}. Ele expira em 1 hora.
      </p>
      <Button
        type='button'
        testId='resend-confirmation-email-button'
        isLoading={isResending}
        onClick={onResend}
        className='h-10 border border-theme-border bg-transparent text-theme-text-primary'
      >
        Reenviar e-mail de confirmação
      </Button>
    </div>
  )
}
