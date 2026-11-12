import type { RefObject } from 'react'

import { ROUTES } from '@/constants'
import { Link } from '../../components/Link'
import { OptionsDivider } from '../../components/OptionsDivider'
import { Title } from '../../components/Title'
import { RocketAnimation } from '../../components/RocketAnimation'
import { AnimatedForm } from '../../components/AnimatedForm'
import { AnimatedHero } from './AnimatedHero'
import { SignInForm } from './SignInForm'
import type { SignInFormFields } from './SignInForm/types'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { SocialLinks } from './SocialLinks'

type Props = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  isRocketVisible: boolean
  handleFormSubmit: (fields: SignInFormFields) => Promise<void>
  unconfirmedEmail: string | null
  isResendingEmail: boolean
  onResendEmail: () => Promise<void>
}

export const SignInPageView = ({
  rocketAnimationRef,
  isRocketVisible,
  handleFormSubmit,
  unconfirmedEmail,
  isResendingEmail,
  onResendEmail,
}: Props) => {
  return (
    <>
      <RocketAnimation animationRef={rocketAnimationRef} isVisible={isRocketVisible} />

      <div className='z-50 h-screen overflow-x-hidden lg:grid lg:grid-cols-[1fr_1.5fr]'>
        <main className='flex h-full flex-col items-center justify-center px-[24px]'>
          <AnimatedForm isVisible={isRocketVisible}>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-3'>
                <Title title='Entre na sua conta' icon='enter' text='' />
                <SocialLinks />
                <OptionsDivider label='ou' />
                <p className='text-sm leading-[1.5] text-theme-text-secondary'>
                  Insira suas informações de cadastro.
                </p>
              </div>

              <SignInForm
                onSubmit={handleFormSubmit}
                unconfirmedEmail={unconfirmedEmail}
                isResendingEmail={isResendingEmail}
                onResendEmail={onResendEmail}
              />

              <div className='flex w-full items-center justify-between'>
                <Link
                  testId='reset-password-link'
                  href={ROUTES.auth.resetPassword}
                  tone='highlight'
                >
                  Esqueci a senha
                </Link>
                <Link
                  testId='create-account-link'
                  href={ROUTES.auth.signUp}
                  tone='highlight'
                >
                  Criar conta
                </Link>
              </div>
            </div>
          </AnimatedForm>
        </main>

        <AnimatedHero isVisible={isRocketVisible} />
      </div>
    </>
  )
}
