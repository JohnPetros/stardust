'use client'

import { useRef } from 'react'

import { ROUTES } from '@/constants'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { Link } from '../../components/Link'
import { RocketAnimation } from '../../components/RocketAnimation'
import { Title } from '../../components/Title'
import { AnimatedForm } from '../../components/AnimatedForm'
import { AnimatedHero } from './AnimatedHero'
import { useSignInPage } from './useSignInPage'
import { SignInForm } from './SignInForm'

export function SignInPage() {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const rocketAnimationRef = useRef<AnimationRef>(null)
  const { isRocketVisible, handleFormSubmit } = useSignInPage(url, rocketAnimationRef)

  return (
    <>
      <RocketAnimation animationRef={rocketAnimationRef} isVisible={isRocketVisible} />

      <div className='h-screen lg:grid lg:grid-cols-[1fr_1.5fr] z-50'>
        <main className='flex h-full flex-col items-center justify-center'>
          <AnimatedForm isVisible={isRocketVisible}>
            <Title
              title='Entre na sua conta'
              text='Insira suas informações de cadastro.'
              icon='enter'
            />
            <div>
              <SignInForm id='sign-in-form' onSubmit={handleFormSubmit} />
            </div>

            <div className='mt-4 flex w-full items-center justify-between'>
              <Link href={ROUTES.auth.resetPassword}>Esqueci a senha</Link>
              <Link href={ROUTES.auth.signUp}>Criar conta</Link>
            </div>
          </AnimatedForm>
        </main>

        <AnimatedHero isVisible={isRocketVisible} />
      </div>
    </>
  )
}
