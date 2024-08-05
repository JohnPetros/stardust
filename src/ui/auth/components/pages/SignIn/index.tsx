'use client'

import { useRef } from 'react'

import { SignInForm } from '@/infra/forms'
import { Button } from '@/ui/global/components/shared/Button'
import { ROUTES } from '@/ui/global/constants'
import type { AnimationRef } from '@/ui/global/components/shared/Animation/types'

import { Link } from '../../shared/Link'
import { RocketAnimation } from '../../shared/RocketAnimation'
import { Title } from '../../shared/Title'

import { AnimatedForm } from '../../shared/AnimatedForm'
import { AnimatedHero } from './AnimatedHero'

import { useSignInPage } from './useSignInPage'

export function SignInPage() {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const rocketAnimationRef = useRef<AnimationRef>(null)

  const { isRocketVisible, handleFormSubmit } = useSignInPage(url, rocketAnimationRef)

  return (
    <>
      <RocketAnimation animationRef={rocketAnimationRef} isVisible={isRocketVisible} />

      <div className='h-screen lg:grid lg:grid-cols-[1fr_1.5fr]'>
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
              <Link href={ROUTES.public.resetPassword}>Esqueci a senha</Link>
              <Link href={ROUTES.public.signUp}>Criar conta</Link>
            </div>
          </AnimatedForm>
        </main>

        <AnimatedHero isVisible={isRocketVisible} />
      </div>
    </>
  )
}
