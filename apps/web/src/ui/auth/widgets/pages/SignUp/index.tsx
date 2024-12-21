'use client'

import { Animation } from '@/ui/global/widgets/components/Animation'
import { Link } from '../../components/Link'
import { Title } from '../../components/Title'
import { AnimatedContainer } from './AnimatedContainer'
import { SignUpForm } from './SignUpForm'

import { useSignUpPage } from './useSignUpPage'

export function SignUpPage() {
  const { isSignUpSuccess, handleFormSubmit } = useSignUpPage()

  return (
    <div className='h-screen'>
      <div className='fixed z-[-5] brightness-[0.25]'>
        <AnimatedContainer delay={0.5}>
          <Animation name='rocket-exploring' size='full' hasLoop={true} />
        </AnimatedContainer>
      </div>

      <main className='flex justify-center w-full h-full'>
        {isSignUpSuccess ? (
          <AnimatedContainer delay={2}>
            <div className='flex-1 flex flex-col justify-center h-full'>
              <p className='text-green-400 font-medium text-lg text-center'>
                Verique o seu e-mail para confirmar o seu cadastro 😉.
              </p>
              <p className='text-green-400 font-medium text-md text-center'>
                Até logo 👋🏻.
              </p>
            </div>
          </AnimatedContainer>
        ) : (
          <AnimatedContainer delay={2}>
            <div className='w-[24rem] pt-12'>
              <div className='text-center'>
                <Title title='Bem-vindo ao StarDust' icon='rocket' text='' />
              </div>
              <SignUpForm id='sign-up-form' onSubmit={handleFormSubmit} />
            </div>

            <div className='mt-6 flex w-full items-center justify-center'>
              <Link href='/sign-in'>Eu já tenho uma conta 😁.</Link>
            </div>
          </AnimatedContainer>
        )}
      </main>
    </div>
  )
}
