import type { RefObject } from 'react'

import { ROUTES } from '@/constants'
import { Link } from '../../components/Link'
import { RocketAnimation } from '../../components/RocketAnimation'
import { Title } from '../../components/Title'
import { AnimatedForm } from '../../components/AnimatedForm'
import { AnimatedHero } from './AnimatedHero'
import { SignInForm } from './SignInForm'
import type { SignInFormFields } from './SignInForm/types'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { SocialLinks } from './SocialLinks'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  isRocketVisible: boolean
  handleFormSubmit: (fields: SignInFormFields) => Promise<void>
}

export const SignInPageView = ({
  rocketAnimationRef,
  isRocketVisible,
  handleFormSubmit,
}: Props) => {
  return (
    <>
      <RocketAnimation animationRef={rocketAnimationRef} isVisible={isRocketVisible} />

      <div className='h-screen lg:grid lg:grid-cols-[1fr_1.5fr] z-50'>
        <main className='flex h-full flex-col items-center justify-center'>
          <AnimatedForm isVisible={isRocketVisible}>
            <div>
              <div className='flex items-center gap-3'>
                <Icon name='enter' className='text-green-400' weight='bold' size={24} />
                <h1 className='text-xl font-medium text-green-400'>Entre na sua conta</h1>
              </div>
              <div className='my-4'>
                <SocialLinks />
              </div>
              <div className='flex items-center gap-2 text-gray-400'>
                <span className='block w-full h-0.5 bg-gray-400' />
                ou
                <span className='block w-full h-0.5 bg-gray-400' />
              </div>
              <p className='mt-2 text-gray-100 tracking-wider'>
                Insira suas informações de cadastro.
              </p>
            </div>

            <div>
              <SignInForm onSubmit={handleFormSubmit} />
            </div>

            <div className='mt-4 flex w-full items-center justify-between'>
              <Link testId='reset-password-link' href={ROUTES.auth.resetPassword}>
                Esqueci a senha
              </Link>
              <Link testId='create-account-link' href={ROUTES.auth.signUp}>
                Criar conta
              </Link>
            </div>
          </AnimatedForm>
        </main>

        <AnimatedHero isVisible={isRocketVisible} />
      </div>
    </>
  )
}
