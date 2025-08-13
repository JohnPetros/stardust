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
      <div className='fixed z-[-5] brightness-[0.25]'>
        <AnimatedOpacity delay={0.5} className='h-full w-full'>
          <Animation name='rocket-exploring' size='full' hasLoop={true} />
        </AnimatedOpacity>
      </div>

      <main className='flex justify-center w-full h-full'>
        {isSignUpSuccessfull ? (
          <AnimatedOpacity delay={2}>
            <div
              data-testid='sign-up-success-message'
              className='flex-1 flex flex-col justify-center h-full'
            >
              <p className='text-green-400 font-medium text-lg text-center'>
                Verique o seu e-mail para confirmar o seu cadastro 😉.
              </p>
              <p className='text-green-400 font-medium text-md text-center'>
                Até logo 👋🏻.
              </p>
              <Button
                onClick={onResendEmail}
                isLoading={isResendingEmail}
                className='mt-6'
              >
                Reenviar e-mail de confirmação de cadastro.
              </Button>
            </div>
          </AnimatedOpacity>
        ) : (
          <AnimatedOpacity delay={2}>
            <div data-testid='sign-up-form' className='w-[24rem] pt-12'>
              <div className='text-center'>
                <Title title='Bem-vindo(a) ao StarDust' icon='rocket' text='' />
              </div>
              <SignUpForm
                profileService={profileService}
                isSubmitting={isSubmitting}
                onSubmit={onFormSubmit}
              />
            </div>

            <div className='mt-6 flex w-full items-center justify-center'>
              <Link testId='sign-in-link' href={ROUTES.auth.signIn}>
                Eu já tenho uma conta 😁.
              </Link>
            </div>
          </AnimatedOpacity>
        )}
      </main>
    </div>
  )
}
