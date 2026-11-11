import type { ProfileService } from '@stardust/core/profile/interfaces'

import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { Button } from '@/ui/global/widgets/components/Button'
import { ROUTES } from '@/constants'
import { Link } from '../../components/Link'
import { Title } from '../../components/Title'
import { SignUpForm } from './SignUpForm'

type Props = {
  isSignUpSuccessfull: boolean
  isResendingEmail: boolean
  isSubmitting: boolean
  profileService: ProfileService
  onFormSubmit: (email: string, password: string, name: string) => Promise<void>
  onResendEmail: () => void
}

export const SignUpPageView = ({
  isSignUpSuccessfull,
  isResendingEmail,
  isSubmitting,
  profileService,
  onFormSubmit,
  onResendEmail,
}: Props) => {
  return (
    <div className='h-screen'>
      <div className='fixed inset-0 z-[-5] overflow-hidden brightness-[0.25]'>
        <AnimatedOpacity
          delay={0.5}
          className='flex h-full w-full items-center justify-center [&>div]:!h-[max(100vw,100vh)] [&>div]:!w-[max(100vw,100vh)] [&>div]:shrink-0'
        >
          <Animation name='rocket-exploring' size='full' hasLoop={true} />
        </AnimatedOpacity>
      </div>

      <main className='flex h-full w-full justify-center px-[24px]'>
        {isSignUpSuccessfull ? (
          <AnimatedOpacity
            delay={2}
            className='flex h-full w-full max-w-[384px] flex-col justify-center'
          >
            <div
              data-testid='sign-up-success-message'
              className='flex flex-col items-center gap-6'
            >
              <div className='text-center font-medium text-theme-accent-text'>
                <p className='text-lg'>
                  Verifique o seu e-mail para confirmar o seu cadastro 😉.
                </p>
                <p className='text-base'>Até logo 👋🏻.</p>
              </div>
              <Button onClick={onResendEmail} isLoading={isResendingEmail}>
                Reenviar e-mail de confirmação de cadastro.
              </Button>
            </div>
          </AnimatedOpacity>
        ) : (
          <AnimatedOpacity delay={2} className='w-full max-w-[384px] pt-[48px]'>
            <div data-testid='sign-up-form' className='flex flex-col gap-6'>
              <Title title='Bem-vindo(a) ao StarDust' icon='rocket' text='' />
              <SignUpForm
                profileService={profileService}
                isSubmitting={isSubmitting}
                onSubmit={onFormSubmit}
              />
            </div>

            <div className='mt-6 flex w-full items-center justify-center'>
              <Link testId='sign-in-link' href={ROUTES.auth.signIn} tone='subtle'>
                Eu já tenho uma conta 😁.
              </Link>
            </div>
          </AnimatedOpacity>
        )}
      </main>
    </div>
  )
}
